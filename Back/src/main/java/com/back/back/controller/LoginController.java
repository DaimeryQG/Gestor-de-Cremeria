package com.back.back.controller;

import com.back.back.model.LoginRequest;
import com.back.back.model.LoginResponse;
import com.back.back.service.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = loginService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }
}
