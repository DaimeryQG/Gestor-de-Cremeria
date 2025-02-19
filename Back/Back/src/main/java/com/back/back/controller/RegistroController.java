package com.back.back.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        if (registro == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);
        return ResponseEntity.ok(registroDTO); // 200
    }

    // Buscar registro por nombre
    @PostMapping("/buscarPorNombre")
    public ResponseEntity<List<RegistroDTO>> buscarPorNombre(@RequestBody Map<String, String> params) {
        String nombre = params.get("nombre");
        List<Registro> registro = registroService.buscarPorNombre(nombre);
        if (registro == null) {
            return ResponseEntity.notFound().build(); // Si no se encuentran registros, devuelve 404
        }
        // Convertir la lista de registros a una lista de DTOs
        List<RegistroDTO> registroDTO = registro.stream()
                .map(RegistroMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(registroDTO); // Si se encuentra el registro, devuelve 200 OK
    }

    // Buscar registro por CURP
    @PostMapping("/buscarPorCurp")
    public ResponseEntity<RegistroDTO> buscarPorCurp(@RequestBody Map<String, String> params) {
        String curp = params.get("curp");
        Registro registro = registroService.buscarPorCurp(curp);
        if (registro == null) {
            return ResponseEntity.notFound().build(); // Si no se encuentran registros, devuelve 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro); // Convertir a DTO
        return ResponseEntity.ok(registroDTO); // Si se encuentra el registro, devuelve 200 OK
    }

    // Buscar registro por RFC
    @PostMapping("/buscarPorRfc")
    public ResponseEntity<RegistroDTO> buscarPorRfc(@RequestBody Map<String, String> params) {
        String rfc = params.get("rfc");
        Registro registro = registroService.buscarPorRfc(rfc);
        if (registro == null) {
            return ResponseEntity.notFound().build(); // Si no se encuentra el registro, devuelve 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro); // Convertir a DTO
        return ResponseEntity.ok(registroDTO); // Si se encuentra el registro, devuelve 200 OK
    }

    // Registrar un nuevo usuario
    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@RequestBody Registro registro) {
        // Validar si ya existe un registro con el mismo RFC o CURP
        boolean existe = registroService.existeRegistroPorRfcOCurp(registro.getRfc(), registro.getCurp());

        if (existe) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un registro con el mismo RFC o CURP.");
        }

        // Si no existe, registrar el nuevo usuario
        Registro nuevoRegistro = registroService.registrar(registro);
        return ResponseEntity.ok("Registro creado exitosamente.");
    }

    // Actualizar registro
    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Long id, @RequestBody Registro registro) {
        try {
            // Verificamos si el registro está desactivado
            Registro registroExistente = registroService.obtenerPorId(id);
            if (registroExistente != null && !registroExistente.isActivo()) {
                // Si está desactivado, no se permite la actualización
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("El registro está desactivado y no puede ser actualizado.");
            }

            // Si está activo, procedemos a actualizar
            Registro registroActualizado = registroService.actualizar(id, registro);
            return ResponseEntity.ok("Registro actualizado correctamente.");
        } catch (RegistroService.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro no encontrado.");
        }
    }

    // Eliminar un registro
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        try {
            // Verificamos si el registro está desactivado
            Registro registroExistente = registroService.obtenerPorId(id);
            if (registroExistente != null && !registroExistente.isActivo()) {
                // Si está desactivado, no se permite la eliminación
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("El registro está desactivado y no puede ser eliminado.");
            }

            // Si está activo, procedemos a eliminar
            registroService.eliminar(id);
            return ResponseEntity.ok("Registro eliminado correctamente.");
        } catch (RegistroService.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro no encontrado.");
        }
    }

    // Desactivar un registro
    @PutMapping("/desactivar/{id}")
    public ResponseEntity<String> desactivarUsuario(@PathVariable Long id) {
        try {
            registroService.desactivar(id); // Llamamos al servicio para desactivar al usuario
            return ResponseEntity.ok("Usuario desactivado correctamente.");
        } catch (RegistroService.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }
    }

    // Activar un registro
    @PutMapping("/activar/{id}")
    public ResponseEntity<String> activarUsuario(@PathVariable Long id) {
        try {
            registroService.activar(id); // Llamamos al servicio para activar al usuario
            return ResponseEntity.ok("Usuario activado correctamente.");
        } catch (RegistroService.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }
    }
}
