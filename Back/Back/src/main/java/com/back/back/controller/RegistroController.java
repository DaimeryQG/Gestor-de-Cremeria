package com.back.back.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.back.back.dto.RegistroDTO;
import com.back.back.mapper.RegistroMapper;
import com.back.back.model.Registro;
import com.back.back.service.RegistroService;

@RestController
@CrossOrigin(origins = {"http://127.0.0.1:8080", "http://localhost:8080"})
@RequestMapping("/registros")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    // Obtener todos los registros
    @GetMapping
    public ResponseEntity<List<RegistroDTO>> obtenerTodos() {
        List<Registro> registros = registroService.obtenerTodos();
        List<RegistroDTO> registroDTOs = registros.stream()
                .map(RegistroMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(registroDTOs);
    }

    // Obtener registro solo por id
    @GetMapping("/{id}")
    public ResponseEntity<RegistroDTO> obtenerPorId(@PathVariable Long id) {
        Registro registro = registroService.obtenerPorId(id);
        if (registro == null) 
        {
            return ResponseEntity.notFound().build(); // 404   
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);
        return ResponseEntity.ok(registroDTO);  // 200
    }

    // Buscar registro por nombre
    @PostMapping("/buscarPorNombre")
    public ResponseEntity<RegistroDTO> buscarPorNombre(@RequestBody Map<String, String> params) {
        String nombre = params.get("nombre");
        Registro registro = registroService.buscarPorNombre(nombre);
        if (registro == null) {
            return ResponseEntity.notFound().build();  // Si no se encuentran registros, devuelve 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);  // Convertir a DTO
        return ResponseEntity.ok(registroDTO);  // Si se encuentra el registro, devuelve 200 OK
    }

    // Buscar registro por CURP
    @PostMapping("/buscarPorCurp")
    public ResponseEntity<RegistroDTO> buscarPorCurp(@RequestBody Map<String, String> params) {
        String curp = params.get("curp");
        Registro registro = registroService.buscarPorCurp(curp);
        if (registro == null) {
            return ResponseEntity.notFound().build();  // Si no se encuentran registros, devuelve 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);  // Convertir a DTO
        return ResponseEntity.ok(registroDTO);  // Si se encuentra el registro, devuelve 200 OK
    }

    // Buscar registro por RFC
    @PostMapping("/buscarPorRfc")
    public ResponseEntity<RegistroDTO> buscarPorRfc(@RequestBody Map<String, String> params) {
        String rfc = params.get("rfc");
        Registro registro = registroService.buscarPorRfc(rfc);
        if (registro == null) {
            return ResponseEntity.notFound().build();  // Si no se encuentra el registro, devuelve 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);  // Convertir a DTO
        return ResponseEntity.ok(registroDTO);  // Si se encuentra el registro, devuelve 200 OK
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
