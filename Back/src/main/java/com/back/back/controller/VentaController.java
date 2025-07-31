package com.back.back.controller;

import com.back.back.model.Venta;
import com.back.back.model.VentaRequest;
import com.back.back.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping
    public ResponseEntity<Venta> registrarVenta(@RequestBody VentaRequest ventaRequest) {
        Venta venta = ventaService.registrarVenta(
                ventaRequest.getUsuario(),
                ventaRequest.getRol(),
                ventaRequest.getDetalles());
        return ResponseEntity.ok(venta);
    }

    @GetMapping
    public ResponseEntity<List<Venta>> obtenerVentas() {
        return ResponseEntity.ok(ventaService.obtenerVentas());
    }
}
