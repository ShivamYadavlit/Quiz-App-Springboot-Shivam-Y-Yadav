package Quiz.App.Quiz.App.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/actuator/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        response.put("status", status);
        return response;
    }
}