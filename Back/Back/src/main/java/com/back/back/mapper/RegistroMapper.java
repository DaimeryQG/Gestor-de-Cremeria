package com.back.back.mapper;

import com.back.back.dto.RegistroDTO;
import com.back.back.model.Registro;

public class RegistroMapper {

    public static RegistroDTO toDTO(Registro registro) {
        return new RegistroDTO(
                registro.getId(),
                registro.getNombre(),
                registro.getCorreo(),
                registro.getTelefono(),
                registro.getDireccion(),
                registro.getRfc(),
                registro.getCurp(),
                registro.getPais(),
                registro.getEstado(),
                registro.getFechaRegistro(),
                registro.getUsername(),
                registro.getRol().getNombre() // Solo el nombre del rol
        );
    }
}
