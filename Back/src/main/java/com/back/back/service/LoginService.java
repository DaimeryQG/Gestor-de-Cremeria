package com.back.back.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.back.model.Registro;
import com.back.back.model.ResponseMessage;
import com.back.back.repository.LoginRepository;
import org.springframework.http.HttpStatus;

@Service
public class LoginService {

    private final LoginRepository loginRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginService(LoginRepository loginRepository, BCryptPasswordEncoder passwordEncoder) {
        this.loginRepository = loginRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseMessage login(String username, String passwordIngresada) {
        Registro usuario = loginRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(passwordIngresada, usuario.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        if (!usuario.isActivo()) {
            throw new RuntimeException("Usuario inactivo. Por favor, contacte con el administrador.");
        }

        return new ResponseMessage("Autenticado correctamente", HttpStatus.OK.value());
    }
}
