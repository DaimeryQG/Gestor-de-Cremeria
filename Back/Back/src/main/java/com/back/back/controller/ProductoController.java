package com.back.back.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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

    // Desactivar un producto
    @PutMapping("/desactivar/{id}")
    public ResponseEntity<Map<String, String>> desactivarProducto(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            productoService.desactivar(id);
            response.put("mensaje", "Producto desactivado correctamente.");
            return ResponseEntity.ok(response);
        } catch (ProductoService.ResourceNotFoundException e) {
            response.put("error", "Producto no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Error al desactivar el producto.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Activar un producto
    @PutMapping("/activar/{id}")
    public ResponseEntity<Map<String, String>> activarProducto(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            productoService.activar(id);
            response.put("mensaje", "Producto activado correctamente.");
            return ResponseEntity.ok(response);
        } catch (ProductoService.ResourceNotFoundException e) {
            response.put("error", "Producto no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Error al activar el producto.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Carga masiva de productos desde CSV
    @PostMapping("/upload-csv")
    public ResponseEntity<Map<String, String>> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            productoService.saveProductosFromCSV(file);
            return ResponseEntity.ok(Collections.singletonMap("mensaje", "Archivo CSV procesado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Error al procesar el archivo CSV: " + e.getMessage()));
        }
    }
}
