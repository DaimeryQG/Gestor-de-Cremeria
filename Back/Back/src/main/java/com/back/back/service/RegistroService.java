package com.back.back.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.back.exception.BadRequestException;
import com.back.back.exception.ConflictException;
import com.back.back.exception.ResourceNotFoundException;
import com.back.back.model.Registro;
import com.back.back.model.Rol;
import com.back.back.repository.RegistroRepository;
import com.back.back.repository.RolRepository;

@Service
public class RegistroService {

    private final RegistroRepository registroRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public RegistroService(RegistroRepository registroRepository, RolRepository rolRepository, BCryptPasswordEncoder passwordEncoder) {
        this.registroRepository = registroRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Registro> obtenerTodos() {
        return registroRepository.findAll();
    }

    public Registro obtenerPorId(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
    }

    public void registrar(Registro registro) {
        if (registroRepository.existsByUsername(registro.getUsername())) {
            throw new ConflictException("El nombre de usuario ya está en uso.");
        }
        registro.setPassword(passwordEncoder.encode(registro.getPassword()));
        registroRepository.save(registro);
    }

    public void actualizar(Long id, Registro registroActualizado) {
        Registro registro = obtenerPorId(id);

        registro.setNombre(registroActualizado.getNombre());
        registro.setCorreo(registroActualizado.getCorreo());
        registro.setTelefono(registroActualizado.getTelefono());
        registro.setDireccion(registroActualizado.getDireccion());
        registro.setRfc(registroActualizado.getRfc());
        registro.setCurp(registroActualizado.getCurp());
        registro.setPais(registroActualizado.getPais());
        registro.setEstado(registroActualizado.getEstado());

        if (registroActualizado.getPassword() != null && !registroActualizado.getPassword().isEmpty()) {
            registro.setPassword(passwordEncoder.encode(registroActualizado.getPassword()));
        }

        if (registroActualizado.getRol() != null && registroActualizado.getRol().getId() != null) {
            Rol rol = rolRepository.findById(registroActualizado.getRol().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + registroActualizado.getRol().getId()));
            registro.setRol(rol);
        }

        registroRepository.save(registro);
    }

    public void eliminar(Long id) {
        Registro registro = obtenerPorId(id);
        registroRepository.delete(registro);
    }

    public void desactivar(Long id) {
        Registro registro = obtenerPorId(id);
        registro.setActivo(false);
        registroRepository.save(registro);
    }

    public void activar(Long id) {
        Registro registro = obtenerPorId(id);
        registro.setActivo(true);
        registroRepository.save(registro);
    }

    public List<Registro> buscarPorUnCampo(String campo, String valor) {
        if (!esCampoValido(campo)) {
            throw new BadRequestException("Campo de búsqueda '" + campo + "' no es válido.");
        }

        Specification<Registro> spec;
        if ("activo".equalsIgnoreCase(campo)) {
            boolean valorBooleano = Boolean.parseBoolean(valor);
            spec = (root, query, cb) -> cb.equal(root.get(campo), valorBooleano);
        } else {
            spec = (root, query, cb) -> cb.like(cb.lower(root.get(campo)), "%" + valor.toLowerCase() + "%");
        }

        List<Registro> resultados = registroRepository.findAll(spec);
        if (resultados.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron registros con " + campo + " = '" + valor + "'.");
        }

        return resultados;
    }

    public boolean esCampoValido(String campo) {
        List<String> camposValidos = Arrays.asList(
            "nombre", "correo", "telefono", "direccion", "rfc", "curp", "pais", 
            "estado", "fechaRegistro", "username", "activo"
        );
        return camposValidos.contains(campo);
    }
}