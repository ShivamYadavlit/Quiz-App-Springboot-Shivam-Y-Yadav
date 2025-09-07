package Quiz.App.Quiz.App.controller;

import Quiz.App.Quiz.App.entity.User;
import Quiz.App.Quiz.App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/register")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminRegistrationController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Admin secret key - should be set via environment variable in production
    @Value("${admin.secret.key:ADMIN_SECRET_2024}")
    private String adminSecretKey;
    
    @PostMapping
    public ResponseEntity<?> registerAdmin(@RequestBody AdminRegistrationRequest request) {
        try {
            // Verify admin secret key
            if (!adminSecretKey.equals(request.getAdminSecretKey())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid admin secret key"));
            }
            
            // Check if username already exists
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username already exists"));
            }
            
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already exists"));
            }
            
            // Create admin user
            User admin = new User();
            admin.setUsername(request.getUsername());
            admin.setEmail(request.getEmail());
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin account created successfully");
            response.put("username", admin.getUsername());
            response.put("role", admin.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to create admin account: " + e.getMessage()));
        }
    }
    
    // DTO for admin registration request
    public static class AdminRegistrationRequest {
        private String username;
        private String email;
        private String password;
        private String adminSecretKey;
        
        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getAdminSecretKey() { return adminSecretKey; }
        public void setAdminSecretKey(String adminSecretKey) { this.adminSecretKey = adminSecretKey; }
    }
}
