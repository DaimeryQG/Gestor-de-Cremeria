package com.back.back.repository;

import com.back.back.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.fechaVenta BETWEEN :inicio AND :fin")
    BigDecimal obtenerTotalVentasPorPeriodo(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.detalles d LEFT JOIN FETCH d.producto WHERE v.fechaVenta BETWEEN :inicio AND :fin")
    List<Venta> findByFechaVentaBetween(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
