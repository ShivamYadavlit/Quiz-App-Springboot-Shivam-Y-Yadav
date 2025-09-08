package Quiz.App.Quiz.App.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    @Field("duration_minutes")
    private Integer durationMinutes;
    
    @Field("total_marks")
    private Integer totalMarks;
    
    private String difficulty = "MEDIUM";
    
    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("is_active")
    private Boolean isActive = true;
    
    // Transient field to hold questions for frontend display
    // This field is not persisted in the database
    @JsonIgnore
    private List<Question> questions;
    
    // Note: In MongoDB, we'll manage questions and results through repository queries
    // instead of direct object mapping to maintain performance
    // Questions will be stored in a separate collection with quiz_id reference
}