package Quiz.App.Quiz.App.controller;

import Quiz.App.Quiz.App.dto.QuizHistoryDto;
import Quiz.App.Quiz.App.dto.QuizResultResponse;
import Quiz.App.Quiz.App.dto.QuizSubmissionRequest;
import Quiz.App.Quiz.App.entity.Question;
import Quiz.App.Quiz.App.entity.Quiz;
import Quiz.App.Quiz.App.entity.QuizResult;
import Quiz.App.Quiz.App.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuizController {
    
    @Autowired
    private QuizService quizService;
    
    @GetMapping("/available")
    public ResponseEntity<List<Quiz>> getAvailableQuizzes() {
        List<Quiz> quizzes = quizService.getActiveQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable String id) {
        Quiz quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
    
    @GetMapping("/{id}/questions")
    public ResponseEntity<List<Question>> getQuizQuestions(@PathVariable String id) {
        List<Question> questions = quizService.getQuizQuestions(id);
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        QuizResultResponse result = quizService.submitQuiz(request.getQuizId(), request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/results/{id}")
    public ResponseEntity<QuizResultResponse> getQuizResult(@PathVariable String id) {
        QuizResultResponse result = quizService.getQuizResult(id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/result/{id}")
    public ResponseEntity<QuizResultResponse> getResult(@PathVariable String id) {
        QuizResultResponse result = quizService.getQuizResult(id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/user-results")
    public ResponseEntity<List<QuizResultResponse>> getUserResults() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<QuizResultResponse> results = quizService.getUserQuizHistoryByUsername(username);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<QuizResultResponse>> getUserQuizHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<QuizResultResponse> history = quizService.getUserQuizHistoryByUsername(username);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/history/summary")
    public ResponseEntity<List<QuizHistoryDto>> getUserQuizHistorySummary() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<QuizHistoryDto> historySummary = quizService.getUserQuizHistorySummaryByUsername(username);
        return ResponseEntity.ok(historySummary);
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<QuizResult>> getLeaderboard(@RequestParam(required = false) String quizId) {
        List<QuizResult> leaderboard = quizService.getLeaderboard(quizId);
        return ResponseEntity.ok(leaderboard);
    }
}
