package com.back.back.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.back.back.model.Producto;
import com.back.back.repository.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Obtener todos los productos
    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findAll();
    }

    // Obtener un producto por ID
    public Optional<Producto> obtenerProductoPorId(Long productoId) {
        return productoRepository.findById(productoId);
    }

    // Crear un nuevo producto
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Actualizar un producto existente
    public Producto actualizarProducto(Long productoId, Producto producto) {
        if (productoRepository.existsById(productoId)) {
            producto.setProductoId(productoId);
            return productoRepository.save(producto);
        }
        return null; // Si el producto no existe, devolver null (o lanzar una excepción)
    }

    // Eliminar un producto
    public boolean eliminarProducto(Long productoId) {
        if (productoRepository.existsById(productoId)) {
            productoRepository.deleteById(productoId);
            return true;
        }
        return false; // Si el producto no existe, devolver false
    }
}