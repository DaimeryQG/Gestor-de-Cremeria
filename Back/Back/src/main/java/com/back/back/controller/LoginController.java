package com.back.back.controller;

import com.back.back.model.LoginRequest;
import com.back.back.model.ResponseMessage;
import com.back.back.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://127.0.0.1:8080", "http://localhost:8080"})
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private RegistroService registroService;

    @PostMapping
    public ResponseMessage login(@RequestBody LoginRequest loginRequest) {
        // Verificamos si las credenciales son correctas
        boolean esAutenticado = registroService.verificarCredenciales(loginRequest.getUsername(), loginRequest.getPassword());
        
        if (esAutenticado) {
            // Si las credenciales son correctas, autenticamos al usuario
            return new ResponseMessage("Autenticado correctamente", HttpStatus.OK.value());
        } else {
            // Si no, devolvemos un mensaje de error
            return new ResponseMessage("Credenciales incorrectas", HttpStatus.UNAUTHORIZED.value());
        }
    }
}
