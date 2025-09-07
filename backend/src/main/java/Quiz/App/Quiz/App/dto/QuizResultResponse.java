package Quiz.App.Quiz.App.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizResultResponse {
    private String id;
    private String quizTitle;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer timeTakenSeconds;
    private LocalDateTime completedAt;
    private List<AnswerReview> answerReviews;
    
    @Data
    public static class AnswerReview {
        private String questionId;
        private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String correctAnswer;
        private String selectedAnswer;
        private Boolean isCorrect;
        private Integer marksObtained;
    }
}
