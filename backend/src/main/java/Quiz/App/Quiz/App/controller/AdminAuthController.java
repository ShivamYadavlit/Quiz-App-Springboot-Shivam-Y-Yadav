package Quiz.App.Quiz.App.controller;

import Quiz.App.Quiz.App.dto.JwtResponse;
import Quiz.App.Quiz.App.dto.LoginRequest;
import Quiz.App.Quiz.App.dto.RegisterRequest;
import Quiz.App.Quiz.App.entity.User;
import Quiz.App.Quiz.App.repository.UserRepository;
import Quiz.App.Quiz.App.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminAuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request);
            
            // Check if the logged in user has admin role
            // This is a basic implementation - you can enhance it
            if (response.getRole() != null && response.getRole().equals("ADMIN")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(403).body("Access denied. Admin privileges required.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // @PostMapping("/register")
    // public ResponseEntity<?> adminSignup(@Valid @RequestBody RegisterRequest request) {
    //     try {
    //         JwtResponse response = adminAuthService.adminSignup(request);
    //         return ResponseEntity.ok(response);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
    
    @PostMapping("/register")
    public ResponseEntity<?> adminRegister(@Valid @RequestBody RegisterRequest request) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new admin user
            User admin = new User();
            admin.setUsername(request.getUsername());
            admin.setEmail(request.getEmail());
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            
            // Use existing auth service to login the new admin
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername(request.getUsername());
            loginRequest.setPassword(request.getPassword());
            
            JwtResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create admin account: " + e.getMessage());
        }
    }
    
    @GetMapping("/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyAdminToken() {
        try {
            // Basic implementation using existing AuthService
            return ResponseEntity.ok("Admin token verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> adminLogout() {
        // Since we're using stateless JWT, logout is handled client-side
        return ResponseEntity.ok("Admin logged out successfully");
    }
    
    // Inner class for admin info response
    public static class AdminInfo {
        private String id;
        private String username;
        private String email;
        
        public AdminInfo(String id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
        
        // Getters
        public String getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        
        // Setters
        public void setId(String id) { this.id = id; }
        public void setUsername(String username) { this.username = username; }
        public void setEmail(String email) { this.email = email; }
    }
}
