package Quiz.App.Quiz.App.service;

import Quiz.App.Quiz.App.dto.QuizHistoryDto;
import Quiz.App.Quiz.App.dto.QuizResultResponse;
import Quiz.App.Quiz.App.dto.QuizSubmissionRequest;
import Quiz.App.Quiz.App.entity.*;
import Quiz.App.Quiz.App.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuizResultRepository quizResultRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MongoAggregationService mongoAggregationService;
    
    public List<Quiz> getActiveQuizzes() {
        return quizRepository.findByIsActiveTrue();
    }
    
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    public Quiz getQuizById(String id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
    
    public List<Question> getQuizQuestions(String quizId) {
        // Verify quiz exists
        getQuizById(quizId);
        List<Question> questions = questionRepository.findByQuizId(quizId);
        
        // Remove correct answers from response for security
        questions.forEach(question -> question.setCorrectAnswer(null));
        
        return questions;
    }
    
    public QuizResultResponse submitQuiz(String quizId, QuizSubmissionRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        // Get user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return performQuizSubmission(quizId, request, user);
    }
    
    public QuizResultResponse submitQuizPublic(String quizId, QuizSubmissionRequest request) {
        // For public submission, get username from request
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username is required for quiz submission");
        }
        
        // Get user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        return performQuizSubmission(quizId, request, user);
    }
    
    private QuizResultResponse performQuizSubmission(String quizId, QuizSubmissionRequest request, User user) {
        // Validate quiz exists
        Quiz quiz = getQuizById(quizId);
        
        // Get all questions for this quiz
        List<Question> questions = questionRepository.findByQuizId(quizId);
        
        // Calculate score
        int score = 0;
        int correctAnswers = 0;
        int wrongAnswers = 0;
        
        // Create quiz result with denormalized data
        QuizResult quizResult = new QuizResult();
        quizResult.setUserId(user.getId()); // Set user ID instead of user object
        quizResult.setQuizId(quiz.getId()); // Set quiz ID instead of quiz object
        quizResult.setUserUsername(user.getUsername()); // Denormalized data
        quizResult.setQuizTitle(quiz.getTitle()); // Denormalized data
        quizResult.setQuizTotalMarks(quiz.getTotalMarks()); // Denormalized data
        quizResult.setScore(score);
        quizResult.setTotalQuestions(questions.size());
        quizResult.setCorrectAnswers(correctAnswers);
        quizResult.setWrongAnswers(wrongAnswers);
        quizResult.setTimeTakenSeconds(request.getTimeTakenSeconds());
        
        QuizResult savedResult = quizResultRepository.save(quizResult);
        
        // Create user answers and calculate score
        List<UserAnswer> userAnswers = new ArrayList<>();
        Map<String, String> submittedAnswers = request.getAnswers(); // Changed from Long to String
        
        for (Question question : questions) {
            UserAnswer userAnswer = new UserAnswer();
            userAnswer.setQuizResultId(savedResult.getId()); // Set quiz result ID
            userAnswer.setQuestionId(question.getId()); // Set question ID instead of object
            
            String submittedAnswer = submittedAnswers.get(question.getId());
            userAnswer.setSelectedAnswer(submittedAnswer);
            
            if (submittedAnswer != null && submittedAnswer.equals(question.getCorrectAnswer())) {
                userAnswer.setIsCorrect(true);
                userAnswer.setMarksObtained(question.getMarks());
                score += question.getMarks();
                correctAnswers++;
            } else {
                userAnswer.setIsCorrect(false);
                userAnswer.setMarksObtained(0);
                wrongAnswers++;
            }
            
            userAnswers.add(userAnswer);
        }
        
        // Update quiz result with final score
        savedResult.setScore(score);
        savedResult.setCorrectAnswers(correctAnswers);
        savedResult.setWrongAnswers(wrongAnswers);
        savedResult = quizResultRepository.save(savedResult);
        
        // Save all user answers
        userAnswerRepository.saveAll(userAnswers);
        
        return buildQuizResultResponse(savedResult, questions, userAnswers);
    }
    
    public List<QuizResultResponse> getUserQuizResults(String userId) {
        List<QuizResult> results = quizResultRepository.findByUserId(userId);
        List<QuizResultResponse> responses = new ArrayList<>();
        
        for (QuizResult result : results) {
            List<Question> questions = questionRepository.findByQuizId(result.getQuizId()); // Use quiz ID
            List<UserAnswer> userAnswers = userAnswerRepository.findByQuizResultId(result.getId());
            responses.add(buildQuizResultResponse(result, questions, userAnswers));
        }
        
        return responses;
    }
    
    public List<QuizResultResponse> getUserQuizHistory(String userId) {
        return getUserQuizResults(userId);
    }
    
    public List<QuizResultResponse> getUserQuizHistoryByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getUserQuizHistory(user.getId());
    }
    
    public List<QuizHistoryDto> getUserQuizHistorySummaryByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getUserQuizHistoryWithAttempts(user.getId());
    }
    
    public List<QuizHistoryDto> getUserQuizHistoryWithAttempts(String userId) {
        // Use MongoDB aggregation service instead of complex JPA queries
        List<Map<String, Object>> statistics = mongoAggregationService.getQuizStatisticsByUserId(userId);
        List<QuizHistoryDto> historyList = new ArrayList<>();
        
        for (Map<String, Object> stat : statistics) {
            QuizHistoryDto history = new QuizHistoryDto();
            history.setQuizId((String) stat.get("_id")); // MongoDB ObjectId as String
            history.setQuizTitle((String) stat.get("quizTitle"));
            history.setQuizDescription(""); // Description not available in aggregation
            history.setTotalQuestions(((Number) stat.get("totalQuestions")).intValue()); // Fixed: was using totalMarks
            history.setAttemptCount(((Number) stat.get("attemptCount")).intValue());
            history.setBestScore(((Number) stat.get("bestScore")).intValue());
            history.setAverageScore(((Number) stat.get("averageScore")).doubleValue());
            history.setFirstAttemptDate((LocalDateTime) stat.get("firstAttempt"));
            history.setLastAttemptDate((LocalDateTime) stat.get("lastAttempt"));
            
            // Get the latest attempt to get the latest score
            List<QuizResult> latestAttempts = quizResultRepository.findByUserIdOrderByCompletedAtDesc(userId);
            if (!latestAttempts.isEmpty()) {
                QuizResult latestAttempt = latestAttempts.get(0);
                history.setLatestScore(latestAttempt.getScore());
                history.setTotalQuestions(latestAttempt.getTotalQuestions()); // Get actual question count
            }
            
            historyList.add(history);
        }
        
        return historyList;
    }
    
    public List<QuizResult> getLeaderboard(String quizId) {
        if (quizId != null) {
            return quizResultRepository.findByQuizIdOrderByScoreDesc(quizId);
        } else {
            return quizResultRepository.findTopByOrderByScoreDesc(50);
        }
    }
    
    public QuizResultResponse getQuizResult(String resultId) {
        QuizResult result = quizResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Quiz result not found"));
        
        List<Question> questions = questionRepository.findByQuizId(result.getQuizId()); // Use quiz ID
        List<UserAnswer> userAnswers = userAnswerRepository.findByQuizResultId(result.getId());
        
        return buildQuizResultResponse(result, questions, userAnswers);
    }
    
    public void deleteUserResults(String userId) {
        List<QuizResult> results = quizResultRepository.findByUserId(userId);
        for (QuizResult result : results) {
            userAnswerRepository.deleteByQuizResultId(result.getId());
        }
        quizResultRepository.deleteByUserId(userId);
    }
    
    private QuizResultResponse buildQuizResultResponse(QuizResult result, 
                                                     List<Question> questions, 
                                                     List<UserAnswer> userAnswers) {
        QuizResultResponse response = new QuizResultResponse();
        response.setId(result.getId());
        response.setQuizTitle(result.getQuizTitle()); // Use denormalized field
        response.setScore(result.getScore());
        response.setTotalQuestions(result.getTotalQuestions());
        response.setCorrectAnswers(result.getCorrectAnswers());
        response.setWrongAnswers(result.getWrongAnswers());
        response.setTimeTakenSeconds(result.getTimeTakenSeconds());
        
        // Use the LocalDateTime field directly
        response.setCompletedAt(result.getCompletedAt());
        
        // Create answer reviews
        Map<String, UserAnswer> answerMap = new HashMap<>(); // Changed from Long to String
        userAnswers.forEach(ua -> answerMap.put(ua.getQuestionId(), ua)); // Use question ID
        
        List<QuizResultResponse.AnswerReview> reviews = new ArrayList<>();
        for (Question question : questions) {
            UserAnswer userAnswer = answerMap.get(question.getId());
            
            QuizResultResponse.AnswerReview review = new QuizResultResponse.AnswerReview();
            review.setQuestionId(question.getId());
            review.setQuestionText(question.getQuestionText());
            review.setOptionA(question.getOptionA());
            review.setOptionB(question.getOptionB());
            review.setOptionC(question.getOptionC());
            review.setOptionD(question.getOptionD());
            review.setCorrectAnswer(question.getCorrectAnswer());
            review.setSelectedAnswer(userAnswer != null ? userAnswer.getSelectedAnswer() : null);
            
            // Handle nullable Boolean and Integer fields
            if (userAnswer != null) {
                review.setIsCorrect(userAnswer.getIsCorrect() != null ? userAnswer.getIsCorrect() : Boolean.FALSE);
                review.setMarksObtained(userAnswer.getMarksObtained() != null ? userAnswer.getMarksObtained() : 0);
            } else {
                review.setIsCorrect(Boolean.FALSE);
                review.setMarksObtained(0);
            }
            
            reviews.add(review);
        }
        
        response.setAnswerReviews(reviews);
        return response;
    }
}
