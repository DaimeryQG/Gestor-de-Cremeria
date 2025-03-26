package com.back.back.model;

public class LoginResponse {
    private String message;
    private String username;
    private String rol;
    private boolean activo;
    private int status;

    public LoginResponse(String message, String username, String rol, boolean activo, int status) {
        this.message = message;
        this.username = username;
        this.rol = rol;
        this.activo = activo;
        this.status = status;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}
