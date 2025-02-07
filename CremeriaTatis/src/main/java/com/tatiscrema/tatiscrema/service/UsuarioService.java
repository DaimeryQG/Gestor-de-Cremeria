package com.tatiscrema.tatiscrema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tatiscrema.tatiscrema.model.Usuario;
import com.tatiscrema.tatiscrema.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public boolean validarCredenciales(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username);
        return usuario != null && usuario.getPassword().equals(password);
    }
}