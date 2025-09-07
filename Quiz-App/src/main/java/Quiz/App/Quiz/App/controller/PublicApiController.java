package Quiz.App.Quiz.App.controller;

import Quiz.App.Quiz.App.dto.QuizHistoryDto;
import Quiz.App.Quiz.App.dto.QuizResultResponse;
import Quiz.App.Quiz.App.dto.QuizSubmissionRequest;
import Quiz.App.Quiz.App.entity.Quiz;
import Quiz.App.Quiz.App.entity.Question;
import Quiz.App.Quiz.App.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicApiController {
    
    @Autowired
    private QuizService quizService;
    
    @GetMapping("/quiz/available")
    public ResponseEntity<List<Quiz>> getAvailableQuizzes() {
        List<Quiz> quizzes = quizService.getActiveQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/quiz/all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/quiz/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable String id) {
        Quiz quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
    
    @GetMapping("/quiz/{id}/questions")
    public ResponseEntity<List<Question>> getQuizQuestions(@PathVariable String id) {
        List<Question> questions = quizService.getQuizQuestions(id);
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/quiz/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        try {
            QuizResultResponse result = quizService.submitQuizPublic(request.getQuizId(), request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Quiz submission failed",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal server error",
                "message", "An unexpected error occurred during quiz submission"
            ));
        }
    }
    
    @GetMapping("/quiz/result/{id}")
    public ResponseEntity<QuizResultResponse> getQuizResult(@PathVariable String id) {
        QuizResultResponse result = quizService.getQuizResult(id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/quiz/user/{username}/history")
    public ResponseEntity<List<QuizResultResponse>> getUserHistory(@PathVariable String username) {
        List<QuizResultResponse> history = quizService.getUserQuizHistoryByUsername(username);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/quiz/user/{username}/history/summary")
    public ResponseEntity<List<QuizHistoryDto>> getUserHistorySummary(@PathVariable String username) {
        List<QuizHistoryDto> historySummary = quizService.getUserQuizHistorySummaryByUsername(username);
        return ResponseEntity.ok(historySummary);
    }
}