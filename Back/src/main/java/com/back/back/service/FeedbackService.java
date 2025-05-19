package com.back.back.service;

import com.back.back.model.Feedback;
import com.back.back.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback guardarFeedback(Feedback feedback) {
        // Verificar que el puntaje no sea null
        if (feedback.getPuntaje() == null) {
            throw new IllegalArgumentException("El puntaje no puede ser nulo.");
        }
    
        // Verificar que el puntaje esté entre 1 y 5
        if (feedback.getPuntaje() < 1 || feedback.getPuntaje() > 5) {
            throw new IllegalArgumentException("El puntaje debe estar entre 1 y 5.");
        }
    
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> obtenerTodos() {
        return feedbackRepository.findAll();
    }
}
