package com.back.back.controller;

import com.back.back.model.Venta;
import com.back.back.service.ReporteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = { "http://127.0.0.1:8080", "http://localhost:8080" })
@RequestMapping("/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    // Obtener reporte de las ventas
    @GetMapping("/ventas")
    public ResponseEntity<List<Venta>> obtenerVentasDetalladas(
            @RequestParam("inicio") String inicio,
            @RequestParam("fin") String fin) {

        LocalDateTime fechaInicio = LocalDateTime.parse(inicio);
        LocalDateTime fechaFin = LocalDateTime.parse(fin);

        List<Venta> ventas = reporteService.obtenerVentasDetalladas(fechaInicio, fechaFin);
        return ResponseEntity.ok(ventas);
    }
}
