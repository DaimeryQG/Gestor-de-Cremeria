package com.tatiscrema.tatiscrema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tatiscrema.tatiscrema.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método para buscar un usuario por su nombre de usuario
    Usuario findByUsername(String username);
}
