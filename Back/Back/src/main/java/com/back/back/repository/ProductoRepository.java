package com.back.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.back.back.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
