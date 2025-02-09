package com.back.back.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.back.model.Registro;
import com.back.back.repository.RegistroRepository;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // 🔹 Inyectamos BCryptPasswordEncoder

    public List<Registro> obtenerTodos() {
        return registroRepository.findAll();
    }

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
                return registroRepository.save(registro);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
    }

    public void eliminar(Long id) {
        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
        registroRepository.delete(registro);
    }

    public boolean verificarCredenciales(String username, String passwordIngresada) {
        Registro usuario = registroRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return passwordEncoder.matches(passwordIngresada, usuario.getPassword());
    }

    // Excepción personalizada
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
}


