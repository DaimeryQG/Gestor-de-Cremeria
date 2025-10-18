package com.back.back.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    public RegistroService(RegistroRepository registroRepository, RolRepository rolRepository,
            BCryptPasswordEncoder passwordEncoder) {
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
        Optional<Registro> registroExistente = registroRepository.findByUsernameOrCorreoOrCurpOrRfcOrTelefono(
                registro.getUsername(), registro.getCorreo(), registro.getCurp(), registro.getRfc(), registro.getTelefono());

        if (registroExistente.isPresent()) {
            Registro existente = registroExistente.get();
            String mensajeError = "Conflicto: ";

            if (existente.getUsername().equals(registro.getUsername())){
                mensajeError += "El nombre de usuario ya está en uso. ";
            }
            if (existente.getCorreo().equals(registro.getCorreo())) {
                mensajeError += "El correo ya está en uso. ";
            }
            if (existente.getCurp().equals(registro.getCurp())) {
                mensajeError += "El CURP ya está en uso. ";
            }
            if (existente.getRfc().equals(registro.getRfc())) {
                mensajeError += "El RFC ya está en uso. ";
            }
            if (existente.getTelefono().equals(registro.getTelefono())) {
                mensajeError += "El teléfono ya está en uso. ";
            }

            throw new ConflictException(mensajeError.trim());
        }

        registro.setPassword(passwordEncoder.encode(registro.getPassword()));
        registroRepository.save(registro);
    }

    public void actualizar(Long id, Registro registroActualizado) {
        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));

        if (!registro.isActivo()) {
            throw new BadRequestException("No se puede actualizar el registro porque no está activo.");
        }

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
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Rol no encontrado con ID: " + registroActualizado.getRol().getId()));
            registro.setRol(rol);
        }

        registroRepository.save(registro);
    }

    public void eliminar(Long id) {
        Registro registro = registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));

        if (!registro.isActivo()) {
            throw new BadRequestException("No se puede eliminar el registro porque no está activo.");
        }

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

    public List<Registro> buscarPorFiltros(Map<String, List<String>> filtros) {
        // Mapear los filtros a las listas que van a ser pasadas a la consulta
        List<String> nombres = filtros.get("nombre");
        List<String> correos = filtros.get("correo");
        List<String> telefonos = filtros.get("telefono");
        List<String> direcciones = filtros.get("direccion");
        List<String> rfcs = filtros.get("rfc");
        List<String> curps = filtros.get("curp");
        List<String> paises = filtros.get("pais");
        List<String> estados = filtros.get("estado");
        List<String> fechasRegistro = filtros.get("fechaRegistro");
        List<String> usernames = filtros.get("username");
        Boolean activo = filtros.containsKey("activo") ? Boolean.parseBoolean(filtros.get("activo").get(0)) : null;
        List<Long> roles = filtros.containsKey("rol") ? filtros.get("rol").stream().map(Long::parseLong).toList() : null;

        return registroRepository.buscarPorFiltros(nombres, correos, telefonos, direcciones, rfcs, curps, paises, estados, fechasRegistro, usernames, activo, roles);
    }
}