package Quiz.App.Quiz.App.service;

import Quiz.App.Quiz.App.dto.LeaderboardEntryDto;
import Quiz.App.Quiz.App.dto.LeaderboardStatsDto;
import Quiz.App.Quiz.App.entity.QuizResult;
import Quiz.App.Quiz.App.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private QuizResultRepository quizResultRepository;
    
    @Autowired
    private MongoAggregationService mongoAggregationService;

    public List<LeaderboardEntryDto> getGlobalLeaderboard(int limit) {
        List<QuizResult> results = quizResultRepository.findTopByOrderByScoreDesc(limit);
        
        return results.stream()
                .map(this::convertToLeaderboardEntry)
                .collect(Collectors.toList());
    }

    public List<LeaderboardEntryDto> getQuizLeaderboard(String quizId, int limit) {
        List<QuizResult> results = quizResultRepository.findTopByQuizIdOrderByScoreDesc(quizId, limit);
        
        return results.stream()
                .map(this::convertToLeaderboardEntry)
                .collect(Collectors.toList());
    }

    public List<LeaderboardEntryDto> getTopPerformers(int limit) {
        List<Map<String, Object>> results = mongoAggregationService.findTopPerformersByAverageScore(limit);
        
        List<LeaderboardEntryDto> leaderboard = new ArrayList<>();
        for (Map<String, Object> result : results) {
            LeaderboardEntryDto entry = new LeaderboardEntryDto();
            
            // Handle compound _id from MongoDB aggregation
            Object idObj = result.get("_id");
            if (idObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> compoundId = (Map<String, Object>) idObj;
                entry.setUserId((String) compoundId.get("userId"));
                entry.setUsername((String) compoundId.get("userUsername"));
            } else {
                // Fallback for simple string ID
                entry.setUserId((String) idObj);
                entry.setUsername((String) result.get("userUsername"));
            }
            
            // Handle average score (could be null or NaN)
            Double avgScore = (Double) result.get("averageScore");
            entry.setScore(avgScore != null && !avgScore.isNaN() ? avgScore.intValue() : 0);
            
            // Handle total attempts
            Integer totalAttempts = (Integer) result.get("attemptCount");
            entry.setTotalAttempts(totalAttempts != null ? totalAttempts : 0);
            
            // Handle percentage (could be null or NaN)
            Double percentage = avgScore != null ? (avgScore / 100.0) * 100 : 0.0;
            entry.setPercentage(percentage != null && !percentage.isNaN() ? percentage : 0.0);
            
            // Set other fields to null/default since this is aggregate data
            entry.setQuizId(null);
            entry.setQuizTitle("Average Performance");
            entry.setTotalQuestions(null);
            entry.setTimeTaken(null);
            entry.setCompletedAt(null);
            
            leaderboard.add(entry);
        }
        
        return leaderboard;
    }

    public List<LeaderboardEntryDto> getWeeklyLeaderboard(int limit) {
        LocalDateTime weekStart = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        List<QuizResult> results = quizResultRepository.findTopByCompletedAtAfterOrderByScoreDesc(weekStart, limit);
        
        return results.stream()
                .map(this::convertToLeaderboardEntry)
                .collect(Collectors.toList());
    }

    public List<LeaderboardEntryDto> getMonthlyLeaderboard(int limit) {
        LocalDateTime monthStart = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        List<QuizResult> results = quizResultRepository.findTopByCompletedAtAfterOrderByScoreDesc(monthStart, limit);
        
        return results.stream()
                .map(this::convertToLeaderboardEntry)
                .collect(Collectors.toList());
    }

    public List<LeaderboardEntryDto> getRecentTopScores(int days, int limit) {
        LocalDateTime fromDate = LocalDateTime.now().minus(days, ChronoUnit.DAYS);
        List<QuizResult> results = quizResultRepository.findTopByCompletedAtAfterOrderByScoreDesc(fromDate, limit);
        
        return results.stream()
                .map(this::convertToLeaderboardEntry)
                .collect(Collectors.toList());
    }

    public List<LeaderboardEntryDto> getRecentLeaderboard(int limit) {
        return getRecentTopScores(7, limit); // Default to 7 days
    }

    public List<LeaderboardEntryDto> getMyRanking(String userId, int context) {
        // Get global leaderboard to determine rankings
        List<LeaderboardEntryDto> globalLeaderboard = getGlobalLeaderboard(1000);
        
        // Find user in global leaderboard and return only their entries
        List<LeaderboardEntryDto> userEntries = new ArrayList<>();
        
        for (int i = 0; i < globalLeaderboard.size(); i++) {
            LeaderboardEntryDto entry = globalLeaderboard.get(i);
            if (entry.getUserId().equals(userId)) {
                entry.setRank(i + 1); // Set proper rank
                userEntries.add(entry);
            }
        }
        
        return userEntries;
    }
    
    public LeaderboardEntryDto getMyPersonalRanking(String username) {
        // Get global leaderboard to determine user's highest ranking
        List<LeaderboardEntryDto> globalLeaderboard = getGlobalLeaderboard(1000);
        
        // Find user's best ranking and aggregate their stats
        LeaderboardEntryDto bestEntry = null;
        int bestRank = Integer.MAX_VALUE;
        int totalAttempts = 0;
        int totalScore = 0;
        
        for (int i = 0; i < globalLeaderboard.size(); i++) {
            LeaderboardEntryDto entry = globalLeaderboard.get(i);
            if (entry.getUsername().equals(username)) {
                totalAttempts++;
                totalScore += entry.getScore();
                
                if (i + 1 < bestRank) {
                    bestRank = i + 1;
                    bestEntry = entry;
                    bestEntry.setRank(bestRank);
                }
            }
        }
        
        if (bestEntry != null) {
            // Update with aggregated stats
            bestEntry.setTotalAttempts(totalAttempts);
            
            // Calculate average score
            if (totalAttempts > 0) {
                int avgScore = totalScore / totalAttempts;
                bestEntry.setScore(avgScore);
            }
            
            return bestEntry;
        }
        
        return null;
    }
    
    public List<LeaderboardEntryDto> getMyRankingByUsername(String username, int context) {
        // Return only the logged-in user's entries, not context
        List<LeaderboardEntryDto> globalLeaderboard = getGlobalLeaderboard(1000);
        List<LeaderboardEntryDto> userEntries = new ArrayList<>();
        
        for (int i = 0; i < globalLeaderboard.size(); i++) {
            LeaderboardEntryDto entry = globalLeaderboard.get(i);
            if (entry.getUsername().equals(username)) {
                entry.setRank(i + 1);
                userEntries.add(entry);
            }
        }
        
        return userEntries;
    }

    public LeaderboardStatsDto getLeaderboardStats() {
        LeaderboardStatsDto stats = new LeaderboardStatsDto();
        
        // Use MongoAggregationService for stats calculation
        stats.setTotalParticipants(mongoAggregationService.countDistinctUsers());
        stats.setTotalAttempts(mongoAggregationService.countTotalAttempts());
        
        Double avgScore = mongoAggregationService.getAverageScore();
        stats.setAverageScore(avgScore != null ? avgScore : 0.0);
        
        Integer highestScore = mongoAggregationService.getHighestScore();
        stats.setHighestScore(highestScore != null ? highestScore : 0);
        
        // Get most active user
        List<Map<String, Object>> mostActiveUsers = mongoAggregationService.findMostActiveUser();
        if (!mostActiveUsers.isEmpty()) {
            Map<String, Object> mostActiveUser = mostActiveUsers.get(0);
            
            // Handle compound _id from MongoDB aggregation
            Object idObj = mostActiveUser.get("_id");
            if (idObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> compoundId = (Map<String, Object>) idObj;
                stats.setMostActiveUser((String) compoundId.get("userUsername"));
            } else {
                stats.setMostActiveUser((String) mostActiveUser.get("userUsername"));
            }
            
            Integer attemptCount = (Integer) mostActiveUser.get("attemptCount");
            stats.setMostActiveUserAttempts(attemptCount != null ? attemptCount : 0);
        }
        
        return stats;
    }

    private LeaderboardEntryDto convertToLeaderboardEntry(QuizResult result) {
        LeaderboardEntryDto entry = new LeaderboardEntryDto();
        entry.setUserId(result.getUserId()); // Use denormalized userId field
        entry.setUsername(result.getUserUsername()); // Use denormalized username field
        entry.setQuizId(result.getQuizId()); // Use denormalized quizId field
        entry.setQuizTitle(result.getQuizTitle()); // Use denormalized quiz title field
        entry.setScore(result.getScore());
        entry.setTotalQuestions(result.getTotalQuestions());
        entry.setTimeTaken(result.getTimeTakenSeconds());
        
        // Set completed date
        entry.setCompletedAt(result.getCompletedAt());
        
        // Calculate percentage based on total questions and score
        if (result.getTotalQuestions() != null && result.getTotalQuestions() > 0) {
            // Get the actual marks per question - assume each question is worth 1 mark
            // If quiz has totalMarks defined, use that; otherwise use totalQuestions
            int totalPossibleMarks = result.getQuizTotalMarks() != null ? 
                result.getQuizTotalMarks() : result.getTotalQuestions();
            
            if (totalPossibleMarks > 0) {
                entry.setPercentage((double) result.getScore() / totalPossibleMarks * 100);
            } else {
                entry.setPercentage(0.0);
            }
        } else {
            entry.setPercentage(0.0);
        }
        
        // Get total attempts for this user (this is expensive but needed for accuracy)
        Long totalAttempts = quizResultRepository.countByUserId(result.getUserId());
        entry.setTotalAttempts(totalAttempts != null ? totalAttempts.intValue() : 0);
        
        return entry;
    }
}
