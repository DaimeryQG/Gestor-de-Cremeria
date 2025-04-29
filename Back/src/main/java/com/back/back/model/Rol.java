package com.back.back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tdRole")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iIdRol")
    private Integer id;

    @Column(name = "cNombreRol")
    private String nombre;

    // Constructores
    public Rol() {}

    public Rol(String nombre) {
        this.nombre = nombre;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}