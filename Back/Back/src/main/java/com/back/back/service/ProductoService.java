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

    // Obtener todos los productos con categoría y proveedor completos
    public List<Producto> getAllProductosWithRelations() {
        return productoRepository.findAllWithRelations();
    }

    // ✅ Agregar este método para obtener un producto por ID con sus relaciones completas
    public Optional<Producto> getProductoByIdWithRelations(Long id) {
        return productoRepository.findByIdWithRelations(id);
    }

    // Guardar un producto y devolverlo con categoría y proveedor completos
    public Producto saveProducto(Producto producto) {
        Producto nuevoProducto = productoRepository.save(producto);
        return productoRepository.findByIdWithRelations(nuevoProducto.getProductoId()).orElse(nuevoProducto);
    }

    // Actualizar un producto manteniendo su categoría y proveedor
    public Producto updateProducto(Long id, Producto producto) {
        return productoRepository.findByIdWithRelations(id)
                .map(existingProducto -> {
                    existingProducto.setNombre(producto.getNombre());
                    existingProducto.setDescripcion(producto.getDescripcion());
                    existingProducto.setPrecio(producto.getPrecio());
                    existingProducto.setStock(producto.getStock());
                    existingProducto.setFechaCaducidad(producto.getFechaCaducidad());
                    existingProducto.setActivo(producto.isActivo());

                    // Asegurar que la categoría y el proveedor no se pierdan
                    if (producto.getCategoria() != null) {
                        existingProducto.setCategoria(producto.getCategoria());
                    }
                    if (producto.getProveedor() != null) {
                        existingProducto.setProveedor(producto.getProveedor());
                    }

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