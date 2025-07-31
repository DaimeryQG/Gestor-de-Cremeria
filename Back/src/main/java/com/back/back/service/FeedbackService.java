package com.back.back.service;

import com.back.back.model.Feedback;
import com.back.back.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback guardarFeedback(Feedback feedback) {
        if (feedback.getPuntaje() == null || feedback.getPuntaje() < 1 || feedback.getPuntaje() > 5) {
            throw new IllegalArgumentException("El puntaje debe estar entre 1 y 5.");
        }

        // Si la fecha no fue enviada, la colocamos automáticamente
        if (feedback.getFecha() == null) {
            feedback.setFecha(LocalDateTime.now());
        }

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> obtenerTodos() {
        return feedbackRepository.findAll();
    }
}
