package Quiz.App.Quiz.App.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "user_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswer {
    
    @Id
    private String id;
    
    // Reference to quiz result by ID instead of object mapping
    @Field("quiz_result_id")
    private String quizResultId;
    
    // Reference to question by ID instead of object mapping
    @Field("question_id")
    private String questionId;
    
    @Field("selected_answer")
    private String selectedAnswer; // A, B, C, D, or null for skipped
    
    @Field("is_correct")
    private Boolean isCorrect;
    
    @Field("marks_obtained")
    private Integer marksObtained;
}
