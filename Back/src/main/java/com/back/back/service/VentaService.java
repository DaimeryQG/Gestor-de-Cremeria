package com.back.back.service;

import com.back.back.model.DetalleVenta;
import com.back.back.model.Producto;
import com.back.back.model.Registro;
import com.back.back.model.Venta;
import com.back.back.repository.ProductoRepository;
import com.back.back.repository.RegistroRepository;
import com.back.back.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final RegistroRepository registroRepository;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository,
            RegistroRepository registroRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.registroRepository = registroRepository;
    }

    @Transactional
    public Venta registrarVenta(String username, String rol, List<DetalleVenta> detalles) {
        if (detalles == null || detalles.isEmpty()) {
            throw new IllegalArgumentException("La venta debe contener al menos un producto.");
        }

        BigDecimal totalVenta = BigDecimal.ZERO;
        Venta venta = new Venta();

        for (DetalleVenta detalle : detalles) {
            if (detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0.");
            }
            if (detalle.getPrecioUnitario() == null || detalle.getPrecioUnitario().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("El precio unitario debe ser mayor a 0.");
            }

            Producto producto = productoRepository.findById(detalle.getProducto().getProductoId())
                    .orElseThrow(() -> new RuntimeException(
                            "Producto no encontrado con ID: " + detalle.getProducto().getProductoId()));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);

            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())));
            totalVenta = totalVenta.add(detalle.getSubtotal());
            detalle.setVenta(venta);
        }

        // Buscar al usuario por el username (ya que la propiedad en Venta es Integer)
        Registro usuario = registroRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));

        Integer usuarioId = usuario.getId();  // Asegúrate de que el ID sea Integer, como se define en Venta

        venta.setUsuario(usuarioId); // Guardamos el ID del usuario
        venta.setRol(rol);
        venta.setTotal(totalVenta);
        venta.setDetalles(detalles);

        return ventaRepository.save(venta);
    }

    public List<Venta> obtenerVentas() {
        List<Venta> ventas = ventaRepository.findAll();

        if (ventas.isEmpty()) {
            throw new RuntimeException("No hay ventas registradas en el sistema.");
        }

        return ventas;
    }
}