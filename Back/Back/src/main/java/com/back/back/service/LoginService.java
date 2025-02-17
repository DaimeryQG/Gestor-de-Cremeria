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
        Registro usuario = loginRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return passwordEncoder.matches(passwordIngresada, usuario.getPassword());
    }
}
