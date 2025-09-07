package Quiz.App.Quiz.App.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuizHistoryDto {
    private String quizId;
    private String quizTitle;
    private String quizDescription;
    private Integer totalQuestions;
    private Integer attemptCount;
    private Integer bestScore;
    private Integer latestScore;
    private LocalDateTime firstAttemptDate;
    private LocalDateTime lastAttemptDate;
    private Double averageScore;
}
