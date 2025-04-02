package com.back.back.dto;

public class ProveedorDTO {

    private Long proveedorId;
    private String nombre;
    private String telefono;
    private String correo;
    private String direccion;
    private boolean activo;

    // Constructor
    public ProveedorDTO(Long proveedorId, String nombre, String telefono, String correo, String direccion, boolean activo) {
        this.proveedorId = proveedorId;
        this.nombre = nombre;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.activo = activo;
    }

    // Getters y Setters
    public Long getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(Long proveedorId) {
        this.proveedorId = proveedorId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public boolean getActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
