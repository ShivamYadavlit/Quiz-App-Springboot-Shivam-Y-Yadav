package Quiz.App.Quiz.App.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    private String id;
    
    @Field("question_text")
    private String questionText;
    
    @Field("option_a")
    private String optionA;
    
    @Field("option_b")
    private String optionB;
    
    @Field("option_c")
    private String optionC;
    
    @Field("option_d")
    private String optionD;
    
    @Field("correct_answer")
    private String correctAnswer; // A, B, C, or D
    
    private Integer marks = 1;
    
    // Reference to quiz by ID instead of object mapping
    @Field("quiz_id")
    private String quizId;
    
    // Note: UserAnswers will be managed through repository queries
    // instead of direct object mapping
}
