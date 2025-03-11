package com.back.back.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.back.back.dto.RegistroDTO;
import com.back.back.mapper.RegistroMapper;
import com.back.back.model.Registro;
import com.back.back.service.RegistroService;

@RestController
@CrossOrigin(origins = { "http://127.0.0.1:8080", "http://localhost:8080" })
@RequestMapping("/registros")
public class RegistroController {

    private final RegistroService registroService;

    public RegistroController(RegistroService registroService) {
        this.registroService = registroService;
    }

    @GetMapping
    public ResponseEntity<List<RegistroDTO>> obtenerTodos() {
        List<RegistroDTO> registroDTOs = registroService.obtenerTodos().stream()
                .map(RegistroMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(registroDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(RegistroMapper.toDTO(registroService.obtenerPorId(id)));
    }

    @PostMapping("/registrar")
    public ResponseEntity<Void> registrar(@RequestBody Registro registro) {
        registroService.registrar(registro);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizar(@PathVariable Long id, @RequestBody Registro registro) {
        registroService.actualizar(id, registro);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        registroService.eliminar(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/desactivar/{id}")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id) {
        registroService.desactivar(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/activar/{id}")
    public ResponseEntity<Void> activarUsuario(@PathVariable Long id) {
        registroService.activar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/buscar")
    public ResponseEntity<?> buscarPorUnCampo(@RequestBody Map<String, String> filtros) {
        return ResponseEntity.ok(registroService.buscarPorUnCampo(filtros));
    }
}
