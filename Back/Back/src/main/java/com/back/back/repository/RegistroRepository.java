package com.back.back.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.back.back.model.Registro;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findByUsername(String username); // Método para encontrar un usuario por su nombre de usuario

    boolean existsByUsername(String username); // Método para verificar si un nombre de usuario ya existe
}