package com.back.back.controller;

import com.back.back.dto.ProveedorDTO;
import com.back.back.mapper.ProveedorMapper;
import com.back.back.model.Proveedor;
import com.back.back.service.ProveedorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    public List<Proveedor> getAllProveedores() {
        return proveedorService.getAllProveedores();
    }

    @GetMapping("/{id}")
    public Proveedor getProveedorById(@PathVariable Long id) {
        return proveedorService.getProveedorById(id);
    }

    @PostMapping
    public Proveedor createProveedor(@RequestBody Proveedor proveedor) {
        return proveedorService.saveProveedor(proveedor);
    }

    @PutMapping("/{id}")
    public Proveedor updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        return proveedorService.updateProveedor(id, proveedor);
    }

    @DeleteMapping("/{id}")
    public void deleteProveedor(@PathVariable Long id) {
        proveedorService.deleteProveedor(id);
    }

    @PatchMapping("/activar/{id}")
    public void activarProveedor(@PathVariable Long id) {
        proveedorService.activar(id);
    }

    @PatchMapping("/desactivar/{id}")
    public void desactivarProveedor(@PathVariable Long id) {
        proveedorService.desactivar(id);
    }

    @PostMapping("/buscar")
    public ResponseEntity<?> buscarPorUnCampo(@RequestBody Map<String, String> filtros) {
        return ResponseEntity.ok(proveedorService.buscarPorUnCampo(filtros));
    }

    @PostMapping("/buscar/dinamico")
    public ResponseEntity<List<ProveedorDTO>> buscarPorFiltros(@RequestBody Map<String, List<String>> filtros) {
        List<Proveedor> proveedores = proveedorService.buscarPorFiltros(filtros);  // Llamada al servicio

        // Mapear proveedores a ProveedorDTO
        List<ProveedorDTO> proveedorDTOs = proveedores.stream()
            .map(ProveedorMapper::toDTO)  // Mapeo usando el ProveedorMapper
            .collect(Collectors.toList());

        return ResponseEntity.ok(proveedorDTOs);
    }
}
