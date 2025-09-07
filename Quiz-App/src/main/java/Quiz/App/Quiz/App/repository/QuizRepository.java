package Quiz.App.Quiz.App.repository;

import Quiz.App.Quiz.App.entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByIsActiveTrue();
    
    // Note: In MongoDB, we'll handle question loading separately
    // through the QuestionRepository for better performance
    // Remove the conflicting findById method as it's inherited from MongoRepository
}
