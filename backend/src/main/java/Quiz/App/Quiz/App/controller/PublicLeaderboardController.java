package Quiz.App.Quiz.App.controller;

import Quiz.App.Quiz.App.dto.LeaderboardEntryDto;
import Quiz.App.Quiz.App.dto.LeaderboardStatsDto;
import Quiz.App.Quiz.App.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicLeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntryDto>> getGlobalLeaderboard(@RequestParam(defaultValue = "50") int limit) {
        try {
            List<LeaderboardEntryDto> leaderboard = leaderboardService.getGlobalLeaderboard(limit);
            
            // Add rank numbers
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).setRank(i + 1);
            }
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<LeaderboardEntryDto>> getQuizLeaderboard(
            @PathVariable String quizId, 
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<LeaderboardEntryDto> leaderboard = leaderboardService.getQuizLeaderboard(quizId, limit);
            
            // Add rank numbers
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).setRank(i + 1);
            }
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<LeaderboardEntryDto>> getRecentLeaderboard(@RequestParam(defaultValue = "20") int limit) {
        try {
            List<LeaderboardEntryDto> leaderboard = leaderboardService.getRecentLeaderboard(limit);
            
            // Add rank numbers
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).setRank(i + 1);
            }
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/top-performers")
    public ResponseEntity<List<LeaderboardEntryDto>> getTopPerformers(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<LeaderboardEntryDto> leaderboard = leaderboardService.getTopPerformers(limit);
            
            // Add rank numbers
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).setRank(i + 1);
            }
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<LeaderboardStatsDto> getLeaderboardStats() {
        try {
            LeaderboardStatsDto stats = leaderboardService.getLeaderboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/my-ranking/{username}")
    public ResponseEntity<List<LeaderboardEntryDto>> getMyRanking(@PathVariable String username) {
        try {
            List<LeaderboardEntryDto> ranking = leaderboardService.getMyRankingByUsername(username, 0);
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/my-personal-ranking/{username}")
    public ResponseEntity<LeaderboardEntryDto> getMyPersonalRanking(@PathVariable String username) {
        try {
            LeaderboardEntryDto personalRanking = leaderboardService.getMyPersonalRanking(username);
            if (personalRanking != null) {
                return ResponseEntity.ok(personalRanking);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/weekly")
    public ResponseEntity<List<LeaderboardEntryDto>> getWeeklyLeaderboard(@RequestParam(defaultValue = "20") int limit) {
        try {
            List<LeaderboardEntryDto> leaderboard = leaderboardService.getWeeklyLeaderboard(limit);
            
            // Add rank numbers
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).setRank(i + 1);
            }
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/monthly")
    public ResponseEntity<List<LeaderboardEntryDto>> getMonthlyLeaderboard(@RequestParam(defaultValue = "20") int limit) {
        try {
            List<LeaderboardEntryDto> leaderboard = leaderboardService.getMonthlyLeaderboard(limit);
            
            // Add rank numbers
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).setRank(i + 1);
            }
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
