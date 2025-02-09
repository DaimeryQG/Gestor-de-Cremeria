package com.back.back.controller;

import com.back.back.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private RegistroService registroService;

    @PostMapping
    public String login(@RequestParam String username, @RequestParam String password) {
        // Verificamos si las credenciales son correctas
        boolean esAutenticado = registroService.verificarCredenciales(username, password);
        
        if (esAutenticado) {
            // Si las credenciales son correctas, autenticamos al usuario
            return "Autenticado correctamente";
        } else {
            // Si no, devolvemos un mensaje de error
            return "Credenciales incorrectas";
        }
    }
}
