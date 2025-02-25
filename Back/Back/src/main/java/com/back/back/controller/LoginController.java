package com.back.back.controller;

import com.back.back.model.LoginRequest;
import com.back.back.model.ResponseMessage;
import com.back.back.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://127.0.0.1:8080", "http://localhost:8080"})
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService; // Aquí inyectas el servicio que contiene la lógica de verificación

    @PostMapping
    public ResponseMessage login(@RequestBody LoginRequest loginRequest) {
        // Verificamos si las credenciales son correctas
        boolean esAutenticado = loginService.verificarCredenciales(loginRequest.getUsername(), loginRequest.getPassword());

        if (esAutenticado) {
            // Verificamos si el usuario está activo usando el servicio
            boolean esActivo = loginService.verificarEstadoUsuario(loginRequest.getUsername()); // Llamas al método del servicio

            if (esActivo) {
                // Si las credenciales son correctas y el usuario está activo, autenticamos al usuario
                return new ResponseMessage("Autenticado correctamente", HttpStatus.OK.value());
            } else {
                // Si el usuario está inactivo, devolvemos un mensaje de error
                return new ResponseMessage("Usuario inactivo. Por favor, contacte con el administrador.", HttpStatus.FORBIDDEN.value());
            }
        } else {
            // Si las credenciales son incorrectas, devolvemos un mensaje de error
            return new ResponseMessage("Credenciales incorrectas", HttpStatus.UNAUTHORIZED.value());
        }
    }
}
