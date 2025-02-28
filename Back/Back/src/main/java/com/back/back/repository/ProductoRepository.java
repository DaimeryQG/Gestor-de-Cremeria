package com.back.back.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.back.back.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Obtener un producto por ID con categoría y proveedor completos
    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria JOIN FETCH p.proveedor WHERE p.productoId = :id")
    Optional<Producto> findByIdWithRelations(@Param("id") Long id);

    // Obtener todos los productos con sus relaciones
    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria JOIN FETCH p.proveedor")
    List<Producto> findAllWithRelations();
}
