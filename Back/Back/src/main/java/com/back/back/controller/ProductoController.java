package com.back.back.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.back.back.model.Producto;
import com.back.back.service.ProductoService;

@RestController
@CrossOrigin(origins = { "http://127.0.0.1:8080", "http://localhost:8080" })
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // Obtener todos los productos con categoría y proveedor completos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductosWithRelations();
    }

    // Obtener un producto por el id con categoría y proveedor completos
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoByIdWithRelations(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear Producto y devolverlo con la categoría y proveedor completos
    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.saveProducto(producto);
        return productoService.getProductoByIdWithRelations(nuevoProducto.getProductoId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualiza un producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        try {
            Producto updatedProducto = productoService.updateProducto(id, producto);
            return ResponseEntity.ok(updatedProducto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }

    // Carga masiva de productos desde CSV
    @PostMapping("/upload-csv")
    public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            productoService.saveProductosFromCSV(file);
            return ResponseEntity.ok("Archivo CSV procesado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar el archivo CSV: " + e.getMessage());
        }
    }
}
