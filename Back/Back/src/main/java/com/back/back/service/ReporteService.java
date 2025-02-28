package com.back.back.service;

import com.back.back.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ReporteService {

    private final VentaRepository ventaRepository;

    public ReporteService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public BigDecimal obtenerTotalVentas(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.obtenerTotalVentasPorPeriodo(inicio, fin);
    }
}
