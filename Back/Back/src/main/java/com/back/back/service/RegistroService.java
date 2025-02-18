package com.back.back.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.back.model.Registro;
import com.back.back.model.Rol;
import com.back.back.repository.RegistroRepository;
import com.back.back.repository.RolRepository;
import com.back.back.service.RegistroService.ResourceNotFoundException;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository; // Repositorio de Registro

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // 🔹 Inyectamos BCryptPasswordEncoder

    // Metodo para obtener todos los registros
    public List<Registro> obtenerTodos() {
        return registroRepository.findAll();
    }

    // Metodo por obtener los registros por el "id"
    public Registro obtenerPorId(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
    }

    public Registro registrar(Registro registro) {
        // Verificamos si el nombre de usuario ya existe
        if (registroRepository.existsByUsername(registro.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        // Encriptamos la contraseña antes de guardar el usuario
        registro.setPassword(passwordEncoder.encode(registro.getPassword()));
        return registroRepository.save(registro);
    }

    public Registro actualizar(Long id, Registro registroActualizado) {
        return registroRepository.findById(id)
            .map(registro -> {
                registro.setNombre(registroActualizado.getNombre());
                registro.setCorreo(registroActualizado.getCorreo());
                registro.setTelefono(registroActualizado.getTelefono());
                registro.setDireccion(registroActualizado.getDireccion());
                registro.setRfc(registroActualizado.getRfc());
                registro.setCurp(registroActualizado.getCurp());
                registro.setPais(registroActualizado.getPais());
                registro.setEstado(registroActualizado.getEstado());

                // Actualización del Rol
                if (registroActualizado.getRol() != null && registroActualizado.getRol().getId() != null) {
                    Rol rol = rolRepository.findById(registroActualizado.getRol().getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + registroActualizado.getRol().getId()));
                    registro.setRol(rol);  // Asignamos el nuevo rol al registro
        
                }
                return registroRepository.save(registro);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
    }

    public void eliminar(Long id) {
        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
        registroRepository.delete(registro);
    }
    
    // Excepción personalizada
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    public Registro buscarPorNombre(String nombre) {
        return registroRepository.findByNombre(nombre);
    }

    public Registro buscarPorCurp(String curp) {
        return registroRepository.findByCurp(curp);
    }

    public Registro buscarPorRfc(String rfc) {
        return registroRepository.findByRfc(rfc);
    } 
}


