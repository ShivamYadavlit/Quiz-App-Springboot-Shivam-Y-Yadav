package Quiz.App.Quiz.App.service;

import Quiz.App.Quiz.App.dto.JwtResponse;
import Quiz.App.Quiz.App.dto.LoginRequest;
import Quiz.App.Quiz.App.dto.RegisterRequest;
import Quiz.App.Quiz.App.entity.User;
import Quiz.App.Quiz.App.repository.UserRepository;
import Quiz.App.Quiz.App.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        
        User savedUser = userRepository.save(user);
        
        String jwt = jwtUtil.generateToken(savedUser);
        
        return new JwtResponse(jwt, savedUser.getId(), savedUser.getUsername(), 
                              savedUser.getEmail(), savedUser.getRole().name());
    }
    
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = (User) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(user);
        
        return new JwtResponse(jwt, user.getId(), user.getUsername(), 
                              user.getEmail(), user.getRole().name());
    }
}
