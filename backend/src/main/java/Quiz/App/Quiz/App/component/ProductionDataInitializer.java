package Quiz.App.Quiz.App.component;

import Quiz.App.Quiz.App.entity.Question;
import Quiz.App.Quiz.App.entity.Quiz;
import Quiz.App.Quiz.App.entity.User;
import Quiz.App.Quiz.App.repository.QuestionRepository;
import Quiz.App.Quiz.App.repository.QuizRepository;
import Quiz.App.Quiz.App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("prod") // Only run in production
public class ProductionDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Starting production data initialization...");
            
            // Test MongoDB connection first
            long userCount = userRepository.count();
            System.out.println("MongoDB connection successful! Found " + userCount + " users.");
            
            // Create default admin user if none exists
            if (userRepository.findByRole(User.Role.ADMIN).isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@quizapp.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                
                userRepository.save(admin);
                System.out.println("=================================================");
                System.out.println("DEFAULT ADMIN USER CREATED:");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
                System.out.println("Email: admin@quizapp.com");
                System.out.println("=================================================");
            }

            // Create sample quizzes if none exist
            if (quizRepository.count() == 0) {
                createSampleQuizzes();
            }

            // Update existing quizzes with difficulty levels if they don't have one
            List<Quiz> quizzesWithoutDifficulty = quizRepository.findAll().stream()
                    .filter(quiz -> quiz.getDifficulty() == null)
                    .toList();

            if (!quizzesWithoutDifficulty.isEmpty()) {
                System.out.println("Updating " + quizzesWithoutDifficulty.size() + " quizzes with difficulty levels...");
                
                for (Quiz quiz : quizzesWithoutDifficulty) {
                    int questionCount = questionRepository.findByQuizId(quiz.getId()).size();
                    
                    // Set difficulty based on question count
                    if (questionCount <= 5) {
                        quiz.setDifficulty("EASY");
                    } else if (questionCount <= 15) {
                        quiz.setDifficulty("MEDIUM");
                    } else {
                        quiz.setDifficulty("HARD");
                    }
                    
                    quizRepository.save(quiz);
                }
                
                System.out.println("Quiz difficulty levels updated successfully!");
            }
            
            System.out.println("MongoDB Database initialized successfully!");
            
        } catch (Exception e) {
            System.err.println("⚠️  WARNING: Database initialization failed but application will continue:");
            System.err.println("Error: " + e.getMessage());
            System.err.println("This is likely due to MongoDB connection issues.");
            System.err.println("Please check your MONGODB_URI environment variable.");
            
            // Don't throw the exception - let the application start anyway
            // This allows the web server to start even if MongoDB is temporarily unavailable
        }
    }
    
    private void createSampleQuizzes() {
        System.out.println("Creating sample quizzes...");
        
        // Java Basics Quiz
        Quiz javaQuiz = new Quiz();
        javaQuiz.setTitle("Java Programming Basics");
        javaQuiz.setDescription("Test your knowledge of Java programming fundamentals");
        javaQuiz.setIsActive(true);
        javaQuiz.setTotalMarks(50);
        javaQuiz.setDurationMinutes(15);
        javaQuiz.setDifficulty("EASY");
        Quiz savedJavaQuiz = quizRepository.save(javaQuiz);
        
        // Create questions for Java Quiz
        Question q1 = new Question();
        q1.setQuizId(savedJavaQuiz.getId());
        q1.setQuestionText("What is the main method signature in Java?");
        q1.setOptionA("public static void main(String[] args)");
        q1.setOptionB("public void main(String[] args)");
        q1.setOptionC("static void main(String[] args)");
        q1.setOptionD("public main(String[] args)");
        q1.setCorrectAnswer("A");
        q1.setMarks(10);
        questionRepository.save(q1);
        
        Question q2 = new Question();
        q2.setQuizId(savedJavaQuiz.getId());
        q2.setQuestionText("Which keyword is used to create a class in Java?");
        q2.setOptionA("class");
        q2.setOptionB("Class");
        q2.setOptionC("create");
        q2.setOptionD("new");
        q2.setCorrectAnswer("A");
        q2.setMarks(10);
        questionRepository.save(q2);
        
        Question q3 = new Question();
        q3.setQuizId(savedJavaQuiz.getId());
        q3.setQuestionText("What is the size of int in Java?");
        q3.setOptionA("16 bits");
        q3.setOptionB("32 bits");
        q3.setOptionC("64 bits");
        q3.setOptionD("8 bits");
        q3.setCorrectAnswer("B");
        q3.setMarks(10);
        questionRepository.save(q3);
        
        Question q4 = new Question();
        q4.setQuizId(savedJavaQuiz.getId());
        q4.setQuestionText("Which of these is not a Java primitive type?");
        q4.setOptionA("int");
        q4.setOptionB("String");
        q4.setOptionC("boolean");
        q4.setOptionD("char");
        q4.setCorrectAnswer("B");
        q4.setMarks(10);
        questionRepository.save(q4);
        
        Question q5 = new Question();
        q5.setQuizId(savedJavaQuiz.getId());
        q5.setQuestionText("What does JVM stand for?");
        q5.setOptionA("Java Virtual Machine");
        q5.setOptionB("Java Variable Method");
        q5.setOptionC("Java Verified Machine");
        q5.setOptionD("Java Visual Machine");
        q5.setCorrectAnswer("A");
        q5.setMarks(10);
        questionRepository.save(q5);
        
        System.out.println("Sample quizzes created successfully!");
    }
}