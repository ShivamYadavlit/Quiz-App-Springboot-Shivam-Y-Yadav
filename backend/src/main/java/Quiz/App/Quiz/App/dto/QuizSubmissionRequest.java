package Quiz.App.Quiz.App.dto;

import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmissionRequest {
    private String quizId;
    private Map<String, String> answers; // questionId -> selectedAnswer (A, B, C, D)
    private Integer timeTakenSeconds;
    private String username; // Add username for identification when using public endpoint
}
