package com.back.back.repository;

import com.back.back.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    // Puedes agregar otros métodos si lo necesitas, pero no es necesario por ahora.
}
