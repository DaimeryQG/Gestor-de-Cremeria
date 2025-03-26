package com.back.back.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.back.back.model.Registro;

public interface RegistroRepository extends JpaRepository<Registro, Long>, JpaSpecificationExecutor<Registro> {
    Optional<Registro> findByUsernameOrCorreoOrCurpOrRfcOrTelefono(String username, String correo, String curp, String rfc, String telefono);
    
    List<Registro> findByNombre(String nombre); // Buscar por nombre

    Optional<Registro> findById(Long id); // Buscar por id

    List<Registro> findByActivoTrue();  // Retorna solo registros activos

     @Query("SELECT r FROM Registro r WHERE "
            + "(r.nombre IN :nombres OR :nombres IS NULL) "
            + "AND (r.correo IN :correos OR :correos IS NULL) "
            + "AND (r.telefono IN :telefonos OR :telefonos IS NULL) "
            + "AND (r.direccion IN :direcciones OR :direcciones IS NULL) "
            + "AND (r.rfc IN :rfcs OR :rfcs IS NULL) "
            + "AND (r.curp IN :curps OR :curps IS NULL) "
            + "AND (r.pais IN :paises OR :paises IS NULL) "
            + "AND (r.estado IN :estados OR :estados IS NULL) "
            + "AND (r.fechaRegistro IN :fechasRegistro OR :fechasRegistro IS NULL) "
            + "AND (r.username IN :usernames OR :usernames IS NULL) "
            + "AND (r.activo = :activo OR :activo IS NULL) "
            + "AND (r.rol.id IN :roles OR :roles IS NULL)")
    List<Registro> buscarPorFiltros(
            @Param("nombres") List<String> nombres,
            @Param("correos") List<String> correos,
            @Param("telefonos") List<String> telefonos,
            @Param("direcciones") List<String> direcciones,
            @Param("rfcs") List<String> rfcs,
            @Param("curps") List<String> curps,
            @Param("paises") List<String> paises,
            @Param("estados") List<String> estados,
            @Param("fechasRegistro") List<String> fechasRegistro,
            @Param("usernames") List<String> usernames,
            @Param("activo") Boolean activo,
            @Param("roles") List<Long> roles);
}