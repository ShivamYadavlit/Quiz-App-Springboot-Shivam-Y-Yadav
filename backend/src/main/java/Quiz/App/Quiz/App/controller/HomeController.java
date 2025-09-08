package Quiz.App.Quiz.App.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Quiz App Backend is running!");
        response.put("status", "success");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}