package com.back.back.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.back.back.model.Producto;
import com.back.back.repository.ProductoRepository;
import com.back.back.utils.CSVHelper;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto producto) {
        return productoRepository.findById(id)
                .map(existingProducto -> {
                    existingProducto.setNombre(producto.getNombre());
                    existingProducto.setDescripcion(producto.getDescripcion());
                    existingProducto.setPrecio(producto.getPrecio());
                    existingProducto.setStock(producto.getStock());
                    existingProducto.setFechaCaducidad(producto.getFechaCaducidad());
                    existingProducto.setActivo(producto.isActivo());
                    return productoRepository.save(existingProducto);
                }).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }

    public void saveProductosFromCSV(MultipartFile file) {
        if (!CSVHelper.hasCSVFormat(file)) {
            throw new RuntimeException("Formato de archivo no compatible, debe ser un CSV");
        }
        try {
            List<Producto> productos = CSVHelper.csvToProductos(file.getInputStream());
            productoRepository.saveAll(productos);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar productos desde CSV: " + e.getMessage());
        }
    }
}