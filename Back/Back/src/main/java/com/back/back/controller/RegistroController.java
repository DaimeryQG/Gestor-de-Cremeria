package com.back.back.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.back.back.model.Registro;
import com.back.back.service.RegistroService;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:8080") 
@RequestMapping("/registros")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    // Obtener todos los registros
    @GetMapping
    public ResponseEntity<List<Registro>> obtenerTodos() {
        List<Registro> registros = registroService.obtenerTodos();
        return ResponseEntity.ok(registros);
    }

    // Obtener registro por ID
    @GetMapping("/{id}")
    public ResponseEntity<Registro> obtenerPorId(@PathVariable Long id) {
        Registro registro = registroService.obtenerPorId(id);
        return ResponseEntity.ok(registro);
    }

    // Registrar un nuevo usuario
    @PostMapping("/registrar")
    public ResponseEntity<Registro> registrar(@RequestBody Registro registro) {
        Registro nuevoRegistro = registroService.registrar(registro);
        return ResponseEntity.ok(nuevoRegistro);
    }

    // Actualizar registro
    @PutMapping("/{id}")
    public ResponseEntity<Registro> actualizar(@PathVariable Long id, @RequestBody Registro registro) {
        Registro registroActualizado = registroService.actualizar(id, registro);
        return ResponseEntity.ok(registroActualizado);
    }

    // Eliminar un registro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        registroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

