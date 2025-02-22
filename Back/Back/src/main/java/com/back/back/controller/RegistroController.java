package com.back.back.controller;

import java.util.HashMap;
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
        if (registro == null || registro.isEmpty()) {
            return ResponseEntity.notFound().build(); // Si no se encuentran registros, devuelve 404
        }
        List<RegistroDTO> registroDTO = registro.stream()
                .map(RegistroMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(registroDTO); // 200 OK
    }

    // Buscar registro por CURP
    @PostMapping("/buscarPorCurp")
    public ResponseEntity<RegistroDTO> buscarPorCurp(@RequestBody Map<String, String> params) {
        String curp = params.get("curp");
        Registro registro = registroService.buscarPorCurp(curp);
        if (registro == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);
        return ResponseEntity.ok(registroDTO); // 200 OK
    }

    // Buscar registro por RFC
    @PostMapping("/buscarPorRfc")
    public ResponseEntity<RegistroDTO> buscarPorRfc(@RequestBody Map<String, String> params) {
        String rfc = params.get("rfc");
        Registro registro = registroService.buscarPorRfc(rfc);
        if (registro == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        RegistroDTO registroDTO = RegistroMapper.toDTO(registro);
        return ResponseEntity.ok(registroDTO); // 200 OK
    }

    // Registrar un nuevo usuario
    @PostMapping("/registrar")
    public ResponseEntity<Map<String, String>> registrar(@RequestBody Registro registro) {
        Map<String, String> response = new HashMap<>();

        boolean existe = registroService.existeRegistroPorRfcOCurp(registro.getRfc(), registro.getCurp());

        if (existe) {
            response.put("error", "Ya existe un registro con el mismo RFC o CURP.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        registroService.registrar(registro);
        response.put("mensaje", "Registro creado exitosamente.");
        return ResponseEntity.ok(response);
    }

    // ✅ Actualizar registro con estructura uniforme
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> actualizar(@PathVariable Long id, @RequestBody Registro registro) {
        Map<String, String> response = new HashMap<>();
        try {
            Registro registroExistente = registroService.obtenerPorId(id);

            if (registroExistente == null) {
                response.put("error", "Registro no encontrado.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if (!registroExistente.isActivo()) {
                response.put("error", "El registro está desactivado y no puede ser actualizado.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            registroService.actualizar(id, registro);
            response.put("mensaje", "Registro actualizado correctamente.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Ocurrió un error al actualizar el registro.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Eliminar un registro
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            Registro registroExistente = registroService.obtenerPorId(id);

            if (registroExistente == null) {
                response.put("error", "Registro no encontrado.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if (!registroExistente.isActivo()) {
                response.put("error", "El registro está desactivado y no puede ser eliminado.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            registroService.eliminar(id);
            response.put("mensaje", "Registro eliminado correctamente.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Ocurrió un error al eliminar el registro.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Desactivar un registro
    @PutMapping("/desactivar/{id}")
    public ResponseEntity<Map<String, String>> desactivarUsuario(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            registroService.desactivar(id);
            response.put("mensaje", "Usuario desactivado correctamente.");
            return ResponseEntity.ok(response);
        } catch (RegistroService.ResourceNotFoundException e) {
            response.put("error", "Usuario no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Error al desactivar el usuario.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Activar un registro
    @PutMapping("/activar/{id}")
    public ResponseEntity<Map<String, String>> activarUsuario(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            registroService.activar(id);
            response.put("mensaje", "Usuario activado correctamente.");
            return ResponseEntity.ok(response);
        } catch (RegistroService.ResourceNotFoundException e) {
            response.put("error", "Usuario no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Error al activar el usuario.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/buscar")
    public ResponseEntity<?> buscarPorUnCampo(@RequestBody Map<String, String> filtros) {
        if (filtros.size() != 1) {
            return ResponseEntity.badRequest().body("Debe proporcionar exactamente un campo para la búsqueda");
        }

        String campo = filtros.keySet().iterator().next();
        String valor = filtros.get(campo);

        if (!registroService.esCampoValido(campo)) {
            return ResponseEntity.badRequest().body("Campo de búsqueda no soportado");
        }

        List<Registro> registros = registroService.buscarPorUnCampo(campo, valor);

        if (registros.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<RegistroDTO> registrosDTO = registros.stream()
                .map(RegistroMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(registrosDTO);
    }
}
