package Quiz.App.Quiz.App.repository;

import Quiz.App.Quiz.App.entity.QuizResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface QuizResultRepository extends MongoRepository<QuizResult, String> {
    List<QuizResult> findByUserIdOrderByCompletedAtDesc(String userId);
    List<QuizResult> findByQuizIdOrderByScoreDesc(String quizId);
    List<QuizResult> findByUserId(String userId);
    void deleteByUserId(String userId);
    
    // Count queries
    Long countByUserId(String userId);
    
    // Leaderboard specific methods without Pageable (MongoDB native)
    @Query(value = "{}", sort = "{ 'score' : -1 }")
    List<QuizResult> findTopByOrderByScoreDesc(int limit);
    
    @Query(value = "{ 'quizId' : ?0 }", sort = "{ 'score' : -1 }")
    List<QuizResult> findTopByQuizIdOrderByScoreDesc(String quizId, int limit);
    
    @Query(value = "{ 'completedAt' : { '$gte' : ?0 } }", sort = "{ 'score' : -1 }")
    List<QuizResult> findTopByCompletedAtAfterOrderByScoreDesc(LocalDateTime fromDate, int limit);
    
    // Additional queries for enhanced admin functionality
    @Query(value = "{ 'userId' : ?0 }")
    List<QuizResult> findResultsByUserId(String userId);
    
    List<QuizResult> findByCompletedAtAfterOrderByCompletedAtDesc(LocalDateTime fromDate);
}
