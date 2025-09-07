package Quiz.App.Quiz.App.controller;

import Quiz.App.Quiz.App.dto.QuestionRequest;
import Quiz.App.Quiz.App.dto.QuizRequest;
import Quiz.App.Quiz.App.entity.Question;
import Quiz.App.Quiz.App.entity.Quiz;
import Quiz.App.Quiz.App.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    // Quiz Management
    @PostMapping("/quizzes")
    public ResponseEntity<Quiz> createQuiz(@Valid @RequestBody QuizRequest request) {
        Quiz quiz = adminService.createQuiz(request);
        return ResponseEntity.ok(quiz);
    }
    
    @PutMapping("/quizzes/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable String id, @Valid @RequestBody QuizRequest request) {
        Quiz quiz = adminService.updateQuiz(id, request);
        return ResponseEntity.ok(quiz);
    }
    
    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String id) {
        adminService.deleteQuiz(id);
        return ResponseEntity.ok("Quiz deleted successfully");
    }
    
    @GetMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = adminService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    // Question Management
    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@Valid @RequestBody QuestionRequest request) {
        Question question = adminService.createQuestion(request);
        return ResponseEntity.ok(question);
    }
    
    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable String id, @Valid @RequestBody QuestionRequest request) {
        Question question = adminService.updateQuestion(id, request);
        return ResponseEntity.ok(question);
    }
    
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String id) {
        adminService.deleteQuestion(id);
        return ResponseEntity.ok("Question deleted successfully");
    }
    
    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuestionsByQuiz(@PathVariable String quizId) {
        List<Question> questions = adminService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }
    
    @GetMapping("/quiz/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuizQuestions(@PathVariable String quizId) {
        List<Question> questions = adminService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }
    
    // Dashboard Stats
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
    
    // User Management
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    
    @GetMapping("/users/detailed")
    public ResponseEntity<?> getAllUsersWithStats() {
        return ResponseEntity.ok(adminService.getAllUsersWithStats());
    }
    
    @PutMapping("/user/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody java.util.Map<String, String> request) {
        adminService.updateUserRole(id, request.get("role"));
        return ResponseEntity.ok("User role updated successfully");
    }
    
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    
    // Reports
    @GetMapping("/reports/user-activity")
    public ResponseEntity<?> getUserActivityReport() {
        return ResponseEntity.ok(adminService.getUserActivityReport());
    }
    
    @GetMapping("/reports/quiz-performance")
    public ResponseEntity<?> getQuizPerformanceReport() {
        return ResponseEntity.ok(adminService.getQuizPerformanceReport());
    }
    
    @GetMapping("/reports/recent-activity")
    public ResponseEntity<?> getRecentActivityReport(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(adminService.getRecentActivityReport(days));
    }
    
    // Results Management
    @GetMapping("/results")
    public ResponseEntity<?> getAllResults() {
        return ResponseEntity.ok(adminService.getAllResults());
    }
    
    @GetMapping("/user/{userId}/results")
    public ResponseEntity<?> getUserResults(@PathVariable String userId) {
        return ResponseEntity.ok(adminService.getUserResults(userId));
    }
    
    @DeleteMapping("/result/{id}")
    public ResponseEntity<?> deleteResult(@PathVariable String id) {
        adminService.deleteResult(id);
        return ResponseEntity.ok("Result deleted successfully");
    }
}
