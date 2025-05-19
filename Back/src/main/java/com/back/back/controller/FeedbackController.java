package com.back.back.controller;

import com.back.back.model.Feedback;
import com.back.back.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = { "http://127.0.0.1:8080", "http://localhost:8080" })
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> guardarFeedback(@RequestBody Feedback feedback) {
        try {
            Feedback feedbackGuardado = feedbackService.guardarFeedback(feedback);
            return ResponseEntity.ok(feedbackGuardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request
        } catch (Exception e) {
            e.printStackTrace(); // Loguea el error para poder revisarlo
            return ResponseEntity.status(500).body(null); // 500 Internal Server Error
        }
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> obtenerFeedbacks() {
        return ResponseEntity.ok(feedbackService.obtenerTodos());
    }
}
