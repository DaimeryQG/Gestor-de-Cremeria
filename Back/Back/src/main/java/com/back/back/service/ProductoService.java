package com.back.back.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.back.back.exception.BadRequestException;
import com.back.back.exception.CSVFormatException;
import com.back.back.exception.ResourceNotFoundException;
import com.back.back.model.Producto;
import com.back.back.repository.ProductoRepository;
import com.back.back.utils.CSVHelper;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    
    private final CSVHelper csvHelper;

    public ProductoService(ProductoRepository productoRepository, CSVHelper csvHelper) {
        this.productoRepository = productoRepository;
        this.csvHelper = csvHelper;
    }

    public List<Producto> getAllProductosWithRelations() {
        return productoRepository.findAllWithRelations();
    }

    public Optional<Producto> getProductoByIdWithRelations(Long id) {
        return productoRepository.findByIdWithRelations(id);
    }

    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto producto) {
        return productoRepository.findByIdWithRelations(id)
                .map(existingProducto -> {
                    existingProducto.setNombre(producto.getNombre());
                    existingProducto.setDescripcion(producto.getDescripcion());
                    existingProducto.setPrecio(producto.getPrecio());
                    existingProducto.setStock(producto.getStock());
                    existingProducto.setFechaCaducidad(producto.getFechaCaducidad());
                    existingProducto.setActivo(producto.isActivo());

                    if (producto.getCategoria() != null) {
                        existingProducto.setCategoria(producto.getCategoria());
                    }
                    if (producto.getProveedor() != null) {
                        existingProducto.setProveedor(producto.getProveedor());
                    }

                    return productoRepository.save(existingProducto);
                }).orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    public void deleteProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }

    public void saveProductosFromCSV(MultipartFile file) {
        if (!CSVHelper.hasCSVFormat(file)) {
            throw new CSVFormatException("Formato de archivo no compatible, debe ser un CSV");
        }

        try {
            List<Producto> productos = csvHelper.csvToProductos(file.getInputStream());

            if (productos.isEmpty()) {
                throw new BadRequestException("El archivo CSV no contiene productos válidos.");
            }

            productoRepository.saveAll(productos);

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar productos desde CSV", e);
        }
    }

    public void desactivar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public void activar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        producto.setActivo(true);
        productoRepository.save(producto);
    }
}
