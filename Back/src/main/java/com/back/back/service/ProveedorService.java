package com.back.back.service;

import com.back.back.exception.BadRequestException;
import com.back.back.model.Proveedor;
import com.back.back.repository.ProveedorRepository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public List<Proveedor> getAllProveedores() {
        return proveedorRepository.findAll();
    }

    public Proveedor getProveedorById(Long id) {
        return proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));
    }

    public Proveedor saveProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public Proveedor updateProveedor(Long id, Proveedor proveedor) {
        Proveedor existingProveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        existingProveedor.setNombre(proveedor.getNombre());
        existingProveedor.setTelefono(proveedor.getTelefono());
        existingProveedor.setCorreo(proveedor.getCorreo());
        existingProveedor.setDireccion(proveedor.getDireccion());
        existingProveedor.setActivo(proveedor.isActivo());

        return proveedorRepository.save(existingProveedor);
    }

    public void deleteProveedor(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        proveedorRepository.delete(proveedor);
    }

    public void activar(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        proveedor.setActivo(true);
        proveedorRepository.save(proveedor);
    }

    public void desactivar(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        proveedor.setActivo(false);
        proveedorRepository.save(proveedor);
    }

    public List<Proveedor> buscarPorUnCampo(Map<String, String> filtros) {
        if (!filtros.containsKey("campo") || !filtros.containsKey("valor")) {
            throw new BadRequestException("Debe proporcionar los parámetros 'campo' y 'valor'.");
        }

        String campo = filtros.get("campo");
        String valor = filtros.get("valor");

        if (!esCampoValido(campo)) {
            throw new BadRequestException("Campo de búsqueda '" + campo + "' no es válido.");
        }

        Specification<Proveedor> spec;

        if ("activo".equalsIgnoreCase(campo)) {
            boolean valorBooleano = Boolean.parseBoolean(valor);
            spec = (root, query, cb) -> cb.equal(root.get(campo), valorBooleano);
        } else if (isStringField(campo)) {
            spec = (root, query, cb) -> cb.like(cb.lower(root.get(campo)), "%" + valor.toLowerCase() + "%");
        } else {
            spec = (root, query, cb) -> cb.equal(root.get(campo), castValueToType(campo, valor));
        }

        return proveedorRepository.findAll(spec);
    }

    private boolean esCampoValido(String campo) {
        List<String> camposValidos = Arrays.asList("nombre", "telefono", "correo", "direccion", "activo");
        return camposValidos.contains(campo);
    }

    private boolean isStringField(String campo) {
        return campo.equalsIgnoreCase("nombre") || campo.equalsIgnoreCase("direccion") || campo.equalsIgnoreCase("correo");
    }

    private Object castValueToType(String campo, String valor) {
        if (campo.equalsIgnoreCase("estado")) {
            return Integer.parseInt(valor);
        }
        return valor;
    }

    public List<Proveedor> buscarPorFiltros(Map<String, List<String>> filtros) {
        List<String> nombres = filtros.get("nombre");
        List<String> correos = filtros.get("correo");
        List<String> telefonos = filtros.get("telefono");
        List<String> direcciones = filtros.get("direccion");
        Boolean activo = filtros.containsKey("activo") ? Boolean.parseBoolean(filtros.get("activo").get(0)) : null;

        return proveedorRepository.buscarPorFiltros(nombres, correos, telefonos, direcciones, activo);
    }
}
