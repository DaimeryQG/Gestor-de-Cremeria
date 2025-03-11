package com.back.back.controller;

import com.back.back.model.LoginRequest;
import com.back.back.model.ResponseMessage;
import com.back.back.service.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://127.0.0.1:8080", "http://localhost:8080"})
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<ResponseMessage> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(loginService.login(loginRequest.getUsername(), loginRequest.getPassword()));
    }
}
