package com.back.back.model;

import java.util.Date;

import jakarta.persistence.*;

@Entity
@Table(name = "tdUsuario")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iIdUsuario")
    private Integer id;

    @Column(name = "cNombre")
    private String nombre;

    @Column(name = "cCorreo")
    private String correo;

    @Column(name = "cTelefono")
    private String telefono;

    @Column(name = "cDireccion")
    private String direccion;

    @Column(name = "cRFC")
    private String rfc;

    @Column(name = "cCURP")
    private String curp;

    @Column(name = "cPais")
    private String pais;

    @Column(name = "cEstado")
    private String estado;

    @Temporal(TemporalType.DATE)
    @Column(name = "dtFechaRegistro")
    private Date fechaRegistro;
    
    @Column(name = "cNombreUsuario")
    private String username;

    @Column(name = "cContrasena")
    private String password;

    @ManyToOne
    @JoinColumn(name = "iIdRol", nullable = false)
    private Rol rol;

    @Column(name = "bActivo")
    private boolean activo = true;

    // Constructores
    public Registro() {}

    public Registro(String nombre, String correo, String telefono, String direccion, String rfc, String curp, String pais, String estado, Date fechaRegistro, Rol rol) {
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.direccion = direccion;
        this.rfc = rfc;
        this.curp = curp;
        this.pais = pais;
        this.estado = estado;
        this.fechaRegistro = fechaRegistro;
        this.rol = rol;
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

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getRfc() {
        return rfc;
    }

    public void setRfc(String rfc) {
        this.rfc = rfc;
    }

    public String getCurp() {
        return curp;
    }

    public void setCurp(String curp) {
        this.curp = curp;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
