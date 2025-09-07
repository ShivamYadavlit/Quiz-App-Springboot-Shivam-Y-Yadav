package Quiz.App.Quiz.App.service;

import Quiz.App.Quiz.App.dto.QuestionRequest;
import Quiz.App.Quiz.App.dto.QuizRequest;
import Quiz.App.Quiz.App.dto.QuizResultResponse;
import Quiz.App.Quiz.App.entity.*;
import Quiz.App.Quiz.App.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private QuizResultRepository quizResultRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Autowired
    private MongoAggregationService mongoAggregationService;
    
    // Quiz Management
    public Quiz createQuiz(QuizRequest request) {
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setDifficulty(request.getDifficulty());
        quiz.setTotalMarks(0);
        quiz.setIsActive(true);
        
        return quizRepository.save(quiz);
    }
    
    public Quiz updateQuiz(String id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setDifficulty(request.getDifficulty());
        
        return quizRepository.save(quiz);
    }
    
    @Transactional
    public void deleteQuiz(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        questionRepository.deleteByQuizId(id);
        quizRepository.delete(quiz);
    }
    
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    // Question Management
    public Question createQuestion(QuestionRequest request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setMarks(request.getMarks());
        question.setQuizId(quiz.getId()); // Set quiz ID instead of quiz object
        
        Question savedQuestion = questionRepository.save(question);
        
        // Update total marks for the quiz
        updateQuizTotalMarks(quiz.getId());
        
        return savedQuestion;
    }
    
    public Question updateQuestion(String id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setMarks(request.getMarks());
        
        Question savedQuestion = questionRepository.save(question);
        
        // Update total marks for the quiz
        updateQuizTotalMarks(question.getQuizId()); // Use quiz ID instead of quiz object
        
        return savedQuestion;
    }
    
    public void deleteQuestion(String id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        String quizId = question.getQuizId(); // Use quiz ID instead of quiz object
        questionRepository.delete(question);
        
        // Update total marks for the quiz
        updateQuizTotalMarks(quizId);
    }
    
    public List<Question> getQuestionsByQuizId(String quizId) {
        return questionRepository.findByQuizId(quizId);
    }
    
    private void updateQuizTotalMarks(String quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        int totalMarks = questions.stream().mapToInt(Question::getMarks).sum();
        
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz != null) {
            quiz.setTotalMarks(totalMarks);
            quizRepository.save(quiz);
        }
    }
    
    // Dashboard Stats
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQuizzes", quizRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalQuestions", questionRepository.count());
        stats.put("totalResults", quizResultRepository.count());
        
        // Additional stats using aggregation service
        stats.put("activeUsers", userRepository.countByRole(User.Role.USER));
        stats.put("adminUsers", userRepository.countByRole(User.Role.ADMIN));
        stats.put("averageScore", mongoAggregationService.getAverageScore());
        stats.put("highestScore", mongoAggregationService.getHighestScore());
        
        return stats;
    }
    
    // Enhanced User Management
    public List<Map<String, Object>> getAllUsersWithStats() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole());
            userInfo.put("createdAt", user.getCreatedAt());
            
            // Get user stats
            Long totalAttempts = quizResultRepository.countByUserId(user.getId());
            userInfo.put("totalAttempts", totalAttempts);
            
            if (totalAttempts > 0) {
                Double avgScore = mongoAggregationService.getAverageScoreByUserId(user.getId());
                Integer bestScore = mongoAggregationService.getBestScoreByUserId(user.getId());
                userInfo.put("averageScore", avgScore != null ? avgScore : 0.0);
                userInfo.put("bestScore", bestScore != null ? bestScore : 0);
            } else {
                userInfo.put("averageScore", 0.0);
                userInfo.put("bestScore", 0);
            }
            
            return userInfo;
        }).collect(Collectors.toList());
    }
    
    // User Activity Reports
    public List<Map<String, Object>> getUserActivityReport() {
        List<Map> results = mongoAggregationService.findUserActivityReport();
        return results.stream().map(result -> {
            Map<String, Object> activity = new HashMap<>();
            activity.put("username", result.get("userUsername"));
            activity.put("totalAttempts", result.get("attemptCount"));
            activity.put("totalScore", result.get("totalScore"));
            activity.put("averageScore", result.get("averageScore"));
            activity.put("lastAttempt", result.get("lastActivity"));
            return activity;
        }).collect(Collectors.toList());
    }
    
    // Quiz Performance Reports
    public List<Map<String, Object>> getQuizPerformanceReport() {
        List<Map> results = mongoAggregationService.findQuizPerformanceReport();
        return results.stream().map(result -> {
            Map<String, Object> performance = new HashMap<>();
            performance.put("quizTitle", result.get("quizTitle"));
            performance.put("totalAttempts", result.get("attemptCount"));
            performance.put("averageScore", result.get("averageScore"));
            performance.put("highestScore", result.get("maxScore"));
            performance.put("lowestScore", result.get("minScore"));
            performance.put("passRate", "N/A"); // Can be calculated if needed
            return performance;
        }).collect(Collectors.toList());
    }
    
    // Recent Activity Report
    public List<Map<String, Object>> getRecentActivityReport(int days) {
        LocalDateTime fromDate = LocalDateTime.now().minus(days, ChronoUnit.DAYS);
        List<QuizResult> recentResults = quizResultRepository.findByCompletedAtAfterOrderByCompletedAtDesc(fromDate);
        
        return recentResults.stream().map(result -> {
            Map<String, Object> activity = new HashMap<>();
            activity.put("username", result.getUserUsername()); // Use denormalized field
            activity.put("quizTitle", result.getQuizTitle()); // Use denormalized field
            activity.put("score", result.getScore());
            activity.put("totalQuestions", result.getTotalQuestions());
            activity.put("percentage", result.getTotalQuestions() > 0 ? 
                (double) result.getScore() / result.getTotalQuestions() * 100 : 0.0);
            activity.put("completedAt", result.getCompletedAt());
            activity.put("timeTaken", result.getTimeTakenSeconds());
            return activity;
        }).collect(Collectors.toList());
    }
    
    // User Management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public void updateUserRole(String userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete user's quiz results and answers
        List<QuizResult> results = quizResultRepository.findByUserId(userId);
        for (QuizResult result : results) {
            userAnswerRepository.deleteByQuizResultId(result.getId());
        }
        quizResultRepository.deleteByUserId(userId);
        
        userRepository.delete(user);
    }
    
    // Results Management
    public List<QuizResult> getAllResults() {
        return quizResultRepository.findAll();
    }
    
    public List<QuizResult> getUserResults(String userId) {
        return quizResultRepository.findByUserId(userId);
    }
    
    @Transactional
    public void deleteResult(String resultId) {
        QuizResult result = quizResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        
        userAnswerRepository.deleteByQuizResultId(resultId);
        quizResultRepository.delete(result);
    }
}
