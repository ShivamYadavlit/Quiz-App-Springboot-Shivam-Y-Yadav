package Quiz.App.Quiz.App.service;

import Quiz.App.Quiz.App.entity.QuizResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service to handle complex MongoDB aggregation queries
 * that were previously handled by JPA queries
 */
@Service
public class MongoAggregationService {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Get quiz statistics for user history
     * Equivalent to the complex JPA query that was removed
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getQuizStatisticsByUserId(String userId) {
        GroupOperation groupByQuiz = Aggregation.group("quizId", "quizTitle", "quizTotalMarks")
                .count().as("attemptCount")
                .max("score").as("bestScore")
                .avg("score").as("averageScore")
                .min("completedAt").as("firstAttempt")
                .max("completedAt").as("lastAttempt");

        MatchOperation matchUser = Aggregation.match(Criteria.where("userId").is(userId));
        SortOperation sortByLastAttempt = Aggregation.sort(Sort.Direction.DESC, "lastAttempt");

        Aggregation aggregation = Aggregation.newAggregation(
                matchUser,
                groupByQuiz,
                sortByLastAttempt
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        return (List<Map<String, Object>>) (List<?>) results.getMappedResults();
    }

    /**
     * Count distinct users who have taken quizzes
     */
    public Long countDistinctUsers() {
        GroupOperation groupByUser = Aggregation.group("userId");
        
        Aggregation aggregation = Aggregation.newAggregation(groupByUser);
        
        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);
        
        return (long) results.getMappedResults().size();
    }

    /**
     * Get average score across all quiz results
     */
    public Double getAverageScore() {
        GroupOperation averageScore = Aggregation.group()
                .avg("score").as("averageScore");

        Aggregation aggregation = Aggregation.newAggregation(averageScore);

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        List<Map> mappedResults = results.getMappedResults();
        if (!mappedResults.isEmpty()) {
            return (Double) mappedResults.get(0).get("averageScore");
        }
        return 0.0;
    }

    /**
     * Get highest score across all quiz results
     */
    public Integer getHighestScore() {
        GroupOperation maxScore = Aggregation.group()
                .max("score").as("highestScore");

        Aggregation aggregation = Aggregation.newAggregation(maxScore);

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        List<Map> mappedResults = results.getMappedResults();
        if (!mappedResults.isEmpty()) {
            return (Integer) mappedResults.get(0).get("highestScore");
        }
        return 0;
    }

    /**
     * Find most active user
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findMostActiveUser() {
        GroupOperation groupByUser = Aggregation.group("userId", "userUsername")
                .count().as("attemptCount");
        
        SortOperation sortByAttempts = Aggregation.sort(Sort.Direction.DESC, "attemptCount");
        
        Aggregation aggregation = Aggregation.newAggregation(
                groupByUser,
                sortByAttempts,
                Aggregation.limit(1)
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        return (List<Map<String, Object>>) (List<?>) results.getMappedResults();
    }

    /**
     * Find top performers by average score
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findTopPerformersByAverageScore(int limit) {
        GroupOperation groupByUser = Aggregation.group("userId", "userUsername")
                .avg("score").as("averageScore")
                .count().as("attemptCount");

        MatchOperation matchMinAttempts = Aggregation.match(Criteria.where("attemptCount").gte(1));
        SortOperation sortByAverage = Aggregation.sort(Sort.Direction.DESC, "averageScore");

        Aggregation aggregation = Aggregation.newAggregation(
                groupByUser,
                matchMinAttempts,
                sortByAverage,
                Aggregation.limit(limit)
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        return (List<Map<String, Object>>) (List<?>) results.getMappedResults();
    }

    /**
     * Get average score by user ID
     */
    public Double getAverageScoreByUserId(String userId) {
        MatchOperation matchUser = Aggregation.match(Criteria.where("userId").is(userId));
        GroupOperation averageScore = Aggregation.group()
                .avg("score").as("averageScore");

        Aggregation aggregation = Aggregation.newAggregation(matchUser, averageScore);

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        List<Map> mappedResults = results.getMappedResults();
        if (!mappedResults.isEmpty()) {
            return (Double) mappedResults.get(0).get("averageScore");
        }
        return 0.0;
    }

    /**
     * Get best score by user ID
     */
    public Integer getBestScoreByUserId(String userId) {
        MatchOperation matchUser = Aggregation.match(Criteria.where("userId").is(userId));
        GroupOperation maxScore = Aggregation.group()
                .max("score").as("bestScore");

        Aggregation aggregation = Aggregation.newAggregation(matchUser, maxScore);

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        List<Map> mappedResults = results.getMappedResults();
        if (!mappedResults.isEmpty()) {
            return (Integer) mappedResults.get(0).get("bestScore");
        }
        return 0;
    }

    /**
     * Get user activity report
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findUserActivityReport() {
        GroupOperation groupByUser = Aggregation.group("userId", "userUsername")
                .count().as("attemptCount")
                .sum("score").as("totalScore")
                .avg("score").as("averageScore")
                .max("completedAt").as("lastActivity");

        SortOperation sortByAttempts = Aggregation.sort(Sort.Direction.DESC, "attemptCount");

        Aggregation aggregation = Aggregation.newAggregation(
                groupByUser,
                sortByAttempts
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        return (List<Map<String, Object>>) (List<?>) results.getMappedResults();
    }

    /**
     * Get quiz performance report
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findQuizPerformanceReport() {
        GroupOperation groupByQuiz = Aggregation.group("quizId", "quizTitle")
                .count().as("attemptCount")
                .avg("score").as("averageScore")
                .max("score").as("maxScore")
                .min("score").as("minScore");

        SortOperation sortByAttempts = Aggregation.sort(Sort.Direction.DESC, "attemptCount");

        Aggregation aggregation = Aggregation.newAggregation(
                groupByQuiz,
                sortByAttempts
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
                aggregation, "quiz_results", Map.class);

        return (List<Map<String, Object>>) (List<?>) results.getMappedResults();
    }
    
    /**
     * Count total quiz attempts
     */
    public Long countTotalAttempts() {
        return mongoTemplate.count(new Query(), "quiz_results");
    }
}