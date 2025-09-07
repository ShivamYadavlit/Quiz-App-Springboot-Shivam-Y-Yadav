package Quiz.App.Quiz.App.dto;

import lombok.Data;

@Data
public class LeaderboardStatsDto {
    private Long totalParticipants;
    private Long totalAttempts;
    private Double averageScore;
    private Integer highestScore;
    private String mostActiveUser;
    private Integer mostActiveUserAttempts;
    private Double participationRate;
    private Integer totalQuizzes;
}
