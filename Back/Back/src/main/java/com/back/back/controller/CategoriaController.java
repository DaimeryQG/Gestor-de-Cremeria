package com.back.back.controller;

import com.back.back.model.Categoria;
import com.back.back.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = { "http://127.0.0.1:8080", "http://localhost:8080" })
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // Obtener todos las categorias
    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaService.getAllCategorias();
    }

    // Crear un producto
    @PostMapping
    public Categoria createCategoria(@RequestBody Categoria categoria) {
        return categoriaService.saveCategoria(categoria);
    }
}
