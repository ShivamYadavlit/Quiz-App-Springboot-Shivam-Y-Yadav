package Quiz.App.Quiz.App.repository;

import Quiz.App.Quiz.App.entity.UserAnswer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAnswerRepository extends MongoRepository<UserAnswer, String> {
    List<UserAnswer> findByQuizResultId(String quizResultId);
    void deleteByQuizResultId(String quizResultId);
}
