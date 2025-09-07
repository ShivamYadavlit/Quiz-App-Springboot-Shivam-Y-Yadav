package Quiz.App.Quiz.App.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "quiz_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResult {
    
    @Id
    private String id;
    
    // Reference to user by ID instead of object mapping
    @Field("user_id")
    private String userId;
    
    // Reference to quiz by ID instead of object mapping
    @Field("quiz_id")
    private String quizId;
    
    // Store user and quiz details for easier querying
    @Field("user_username")
    private String userUsername;
    
    @Field("quiz_title")
    private String quizTitle;
    
    @Field("quiz_total_marks")
    private Integer quizTotalMarks;
    
    private Integer score;
    
    @Field("total_questions")
    private Integer totalQuestions;
    
    @Field("correct_answers")
    private Integer correctAnswers;
    
    @Field("wrong_answers")
    private Integer wrongAnswers;
    
    @Field("time_taken_seconds")
    private Integer timeTakenSeconds;
    
    @Field("completed_at")
    private LocalDateTime completedAt = LocalDateTime.now();
    
    // Note: UserAnswers will be managed through repository queries
    // instead of direct object mapping
    
    // Helper methods for leaderboard
    public Integer getTotalMarks() {
        return this.quizTotalMarks != null ? this.quizTotalMarks : 0;
    }
    
    public Integer getTimeTaken() {
        return this.timeTakenSeconds != null ? this.timeTakenSeconds : 0;
    }
    
    // Getter for LocalDateTime field directly
    public LocalDateTime getCompletedAtLocal() {
        return this.completedAt;
    }
}
