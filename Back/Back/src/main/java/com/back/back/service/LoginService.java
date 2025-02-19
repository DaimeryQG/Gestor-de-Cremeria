package com.back.back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.back.model.Registro;
import com.back.back.repository.LoginRepository;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public boolean verificarCredenciales(String username, String passwordIngresada) {
        // Intentamos obtener el usuario usando Optional
        Registro usuario = loginRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificamos que la contraseña ingresada coincida con la almacenada
        return passwordEncoder.matches(passwordIngresada, usuario.getPassword());
    }

    public boolean verificarEstadoUsuario(String username) {
        // Intentamos obtener el usuario usando Optional
        Registro usuario = loginRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificamos si el usuario está activo
        return usuario.isActivo(); // Retorna true si el usuario está activo, false si está inactivo
    }    
}
