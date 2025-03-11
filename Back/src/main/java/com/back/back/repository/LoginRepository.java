package com.back.back.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.back.model.Registro;

@Repository
public interface LoginRepository extends JpaRepository<Registro, Long> {
    boolean existsByUsername(String username); // Método para verificar si un nombre de usuario ya existe

    Optional<Registro> findByUsername(String username); // Método para encontrar un usuario por su nombre de usuario
}
