package com.back.back.mapper;

import com.back.back.dto.ProveedorDTO;
import com.back.back.model.Proveedor;

public class ProveedorMapper {

    public static ProveedorDTO toDTO(Proveedor proveedor) {
        return new ProveedorDTO(
            proveedor.getProveedorId(),
            proveedor.getNombre(),
            proveedor.getTelefono(),
            proveedor.getCorreo(),
            proveedor.getDireccion(),
            proveedor.isActivo()
        );
    }
}
