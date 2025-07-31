package com.back.back.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.back.back.exception.BadRequestException;
import com.back.back.exception.CSVFormatException;
import com.back.back.exception.ConflictException;
import com.back.back.exception.ResourceNotFoundException;
import com.back.back.model.Producto;
import com.back.back.repository.CategoriaRepository;
import com.back.back.repository.ProductoRepository;
import com.back.back.repository.ProveedorRepository;
import com.back.back.utils.CSVHelper;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProveedorRepository proveedorRepository;
    private final CSVHelper csvHelper;

    public ProductoService(ProductoRepository productoRepository, CSVHelper csvHelper,
                      CategoriaRepository categoriaRepository, ProveedorRepository proveedorRepository) {
    this.productoRepository = productoRepository;
    this.csvHelper = csvHelper;
    this.categoriaRepository = categoriaRepository;
    this.proveedorRepository = proveedorRepository;
    }

    public List<Producto> getAllProductosWithRelations() {
        return productoRepository.findAllWithRelations();
    }

    public Producto getProductoByIdWithRelations(Long id) {
        return productoRepository.findByIdWithRelations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }

    public Producto saveProducto(Producto producto) {
        Optional<Producto> productoExistente = productoRepository.findByNombre(
                producto.getNombre());

        if (productoExistente.isPresent()) {
            Producto existente = productoExistente.get();
            String mensajeError = "Conflicto: ";

            if (existente.getNombre().equals(producto.getNombre())) {
                mensajeError += "El nombre de usuario ya está en uso. ";
            }

            throw new ConflictException(mensajeError.trim());
        }
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto producto) {
    return productoRepository.findByIdWithRelations(id)
        .map(existingProducto -> {
            if (!existingProducto.isActivo()) {
                throw new IllegalStateException("No se puede actualizar el producto porque no está activo.");
            }

            existingProducto.setNombre(producto.getNombre());
            existingProducto.setDescripcion(producto.getDescripcion());
            existingProducto.setPrecio(producto.getPrecio());
            existingProducto.setStock(producto.getStock());
            existingProducto.setFechaCaducidad(producto.getFechaCaducidad());
            existingProducto.setActivo(producto.isActivo());

            // Validar categoría solo si no es null y existe en BD
            if (producto.getCategoria() != null) {
                Long categoriaId = Long.valueOf(producto.getCategoria().getCategoriaId());
                if (categoriaId != null && categoriaRepository.existsById(categoriaId)) {
                    existingProducto.setCategoria(producto.getCategoria());
                } else {
                    throw new IllegalArgumentException("La categoría proporcionada no existe.");
                }
            }

            // Validar proveedor solo si no es null y existe en BD
            if (producto.getProveedor() != null) {
                Long proveedorId = producto.getProveedor().getProveedorId();
                if (proveedorId != null && proveedorRepository.existsById(proveedorId)) {
                    existingProducto.setProveedor(producto.getProveedor());
                } else {
                    throw new IllegalArgumentException("El proveedor proporcionado no existe.");
                }
            }

            return productoRepository.save(existingProducto);
        })
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
}


    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (!producto.isActivo()) {
            throw new IllegalStateException("No se puede eliminar el producto porque no está activo.");
        }

        productoRepository.deleteById(id);
    }

    public void saveProductosFromCSV(MultipartFile file) {
        if (!CSVHelper.hasCSVFormat(file)) {
            throw new CSVFormatException("Formato de archivo no compatible, debe ser un CSV");
        }

        try {
            List<Producto> productos = csvHelper.csvToProductos(file.getInputStream());

            if (productos.isEmpty()) {
                throw new BadRequestException("El archivo CSV no contiene productos válidos.");
            }

            productoRepository.saveAll(productos);

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar productos desde CSV", e);
        }
    }

    public void desactivar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public void activar(Long id) {
    Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    producto.setActivo(true);
    productoRepository.save(producto);
}

    public List<Producto> buscarPorUnCampo(Map<String, String> filtros) {
        if (!filtros.containsKey("campo") || !filtros.containsKey("valor")) {
            throw new BadRequestException("Debe proporcionar los parámetros 'campo' y 'valor'.");
        }

        String campo = filtros.get("campo");
        String valor = filtros.get("valor");

        if (!esCampoValido(campo)) {
            throw new BadRequestException("Campo de búsqueda '" + campo + "' no es válido.");
        }

        Specification<Producto> spec;
        if ("activo".equalsIgnoreCase(campo)) {
            boolean valorBooleano = Boolean.parseBoolean(valor);
            spec = (root, query, cb) -> cb.equal(root.get(campo), valorBooleano);
        } else {
            spec = (root, query, cb) -> cb.like(cb.lower(root.get(campo)), "%" + valor.toLowerCase() + "%");
        }

        List<Producto> resultados = productoRepository.findAll(spec);
        if (resultados.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron registros con " + campo + " = '" + valor + "'.");
        }

        return resultados;
    }

    private boolean esCampoValido(String campo) {
        List<String> camposValidos = Arrays.asList(
                "nombre", "descripcion", "precio", "stock", "categoria", "proveedor",
                "fechaCaducidad", "fechaRegistro", "activo");
        return camposValidos.contains(campo);
    }
}
 