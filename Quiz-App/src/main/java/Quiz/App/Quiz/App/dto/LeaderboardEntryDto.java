package Quiz.App.Quiz.App.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LeaderboardEntryDto {
    private String userId;
    private String username;
    private String quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;
    private LocalDateTime completedAt;
    private Integer timeTaken; // in seconds
    private Integer totalAttempts;
    private Integer rank;
}
