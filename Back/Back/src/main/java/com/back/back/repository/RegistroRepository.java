package com.back.back.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.back.back.model.Registro;

public interface RegistroRepository extends JpaRepository<Registro, Long>, JpaSpecificationExecutor<Registro> {
    Optional<Registro> findByUsernameOrCorreoOrCurpOrRfcOrTelefono(String username, String correo, String curp, String rfc, String telefono);
    
    List<Registro> findByNombre(String nombre); // Buscar por nombre

    Optional<Registro> findById(Long id); // Buscar por id

    List<Registro> findByActivoTrue();  // Retorna solo registros activos
}