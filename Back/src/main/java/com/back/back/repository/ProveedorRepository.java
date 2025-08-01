package com.back.back.repository;

import com.back.back.model.Proveedor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long>, JpaSpecificationExecutor<Proveedor> {

    @Query("SELECT p FROM Proveedor p WHERE " +
            "(:nombres IS NULL OR p.nombre IN :nombres) AND " +
            "(:correos IS NULL OR p.correo IN :correos) AND " +
            "(:telefonos IS NULL OR p.telefono IN :telefonos) AND " +
            "(:direcciones IS NULL OR p.direccion IN :direcciones) AND " +
            "(:activo IS NULL OR p.activo = :activo)")
    List<Proveedor> buscarPorFiltros(
        List<String> nombres,
        List<String> correos,
        List<String> telefonos,
        List<String> direcciones,
        Boolean activo
    );
}