package com.back.back.controller;

import com.back.back.model.DetalleVenta;
import com.back.back.model.Venta;
import com.back.back.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = { "http://127.0.0.1:8080", "http://localhost:8080" })
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    // 🔹 Registrar una nueva venta con validaciones
    @PostMapping
    public ResponseEntity<?> registrarVenta(@RequestBody List<DetalleVenta> detalles) {
        try {
            // ✅ Validar que haya detalles en la venta
            if (detalles == null || detalles.isEmpty()) {
                return ResponseEntity.badRequest().body("❌ La venta debe contener al menos un producto.");
            }

            // ✅ Validar cada detalle de la venta
            for (DetalleVenta detalle : detalles) {
                if (detalle.getCantidad() <= 0) {
                    return ResponseEntity.badRequest().body("❌ La cantidad debe ser mayor a 0.");
                }
                if (detalle.getPrecioUnitario().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                    return ResponseEntity.badRequest().body("❌ El precio unitario debe ser mayor a 0.");
                }
            }

            // ✅ Intentar registrar la venta
            Venta venta = ventaService.registrarVenta(detalles);
            return ResponseEntity.ok(venta);
        } catch (Exception e) {
            // 🔹 Imprimir error en la consola para depuración
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Error al registrar la venta: " + e.getMessage());
        }
    }

    // 🔹 Obtener todas las ventas con manejo de errores
    @GetMapping
    public ResponseEntity<?> obtenerVentas() {
        List<Venta> ventas = ventaService.obtenerVentas();

        // ✅ Si no hay ventas registradas, devolver un mensaje amigable
        if (ventas.isEmpty()) {
            return ResponseEntity.ok("⚠️ No hay ventas registradas en el sistema.");
        }

        return ResponseEntity.ok(ventas);
    }
}
