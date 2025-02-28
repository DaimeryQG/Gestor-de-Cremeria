package com.back.back.service;

import com.back.back.model.DetalleVenta;
import com.back.back.model.Producto;
import com.back.back.model.Venta;
import com.back.back.repository.ProductoRepository;
import com.back.back.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public Venta registrarVenta(List<DetalleVenta> detalles) {
        BigDecimal totalVenta = BigDecimal.ZERO;
        Venta venta = new Venta();

        for (DetalleVenta detalle : detalles) {
            Producto producto = productoRepository.findById(detalle.getProducto().getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // Descontar stock
            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);

            // Calcular subtotal
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())));
            totalVenta = totalVenta.add(detalle.getSubtotal());
            detalle.setVenta(venta);
        }

        venta.setTotal(totalVenta);
        venta.setDetalles(detalles);
        return ventaRepository.save(venta);
    }

    public List<Venta> obtenerVentas() {
        return ventaRepository.findAll();
    }
}
