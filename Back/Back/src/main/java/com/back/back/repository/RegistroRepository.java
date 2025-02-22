package com.back.back.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.back.back.model.Registro;

public interface RegistroRepository extends JpaRepository<Registro, Long>, JpaSpecificationExecutor<Registro> {
    boolean existsByUsername(String username); // Método para verificar si un nombre de usuario ya existe
    
    List<Registro> findByNombre(String nombre); // Buscar por nombre

    Registro findByCurp(String curp); // Buscar por curp

    Registro findByRfc(String rfc); // Buscar por rfc

    Optional<Registro> findById(Long id); // Buscar por id

    boolean existsByRfcOrCurp(String rfc, String curp);
    
    List<Registro> findByActivoTrue();  // Retorna solo registros activos
}