package Quiz.App.Quiz.App.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class QuestionRequest {
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    @NotBlank(message = "Option A is required")
    private String optionA;
    
    @NotBlank(message = "Option B is required")
    private String optionB;
    
    @NotBlank(message = "Option C is required")
    private String optionC;
    
    @NotBlank(message = "Option D is required")
    private String optionD;
    
    @NotBlank(message = "Correct answer is required")
    @Pattern(regexp = "^[ABCD]$", message = "Correct answer must be A, B, C, or D")
    private String correctAnswer;
    
    private Integer marks = 1;
    
    @NotNull(message = "Quiz ID is required")
    private String quizId;
}
