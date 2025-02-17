package com.back.back.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.back.back.model.Registro;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    boolean existsByUsername(String username); // Método para verificar si un nombre de usuario ya existe
    
    Registro findByNombre(String nombre); // Buscar por nombre

    Registro findByCurp(String curp); // Buscar por curp

    Registro findByRfc(String rfc); // Buscar por rfc

    Optional<Registro> findById(Long id); // Buscar por id
    
}