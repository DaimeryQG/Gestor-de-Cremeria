package com.back.back.service;

import com.back.back.exception.BadRequestException;
import com.back.back.exception.ResourceNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.back.model.Registro;
import com.back.back.model.LoginResponse;
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

    public LoginResponse login(String username, String passwordIngresada) {
        Registro usuario = loginRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(passwordIngresada, usuario.getPassword())) {
            throw new BadRequestException("Credenciales incorrectas");
        }

        if (!usuario.isActivo()) {
            throw new BadRequestException("Usuario inactivo. Por favor, contacte con el administrador.");
        }

        // Validar y extraer rol
        if (usuario.getRol() == null || usuario.getRol().getNombre() == null) {
            throw new BadRequestException("El usuario no tiene un rol asignado o el rol es inválido.");
        }
        String rolUsuario = usuario.getRol().getNombre();

        return new LoginResponse(
                "Autenticado correctamente",
                usuario.getUsername(),
                rolUsuario,
                usuario.isActivo(),
                HttpStatus.OK.value()
        );
    }
}
