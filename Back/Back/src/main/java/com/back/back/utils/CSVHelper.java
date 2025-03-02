package com.back.back.utils;

import com.back.back.model.Producto;
import com.back.back.model.Categoria;
import com.back.back.model.Proveedor;
import com.back.back.repository.CategoriaRepository;
import com.back.back.repository.ProveedorRepository;
import org.apache.commons.csv.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class CSVHelper {

    public static String TYPE = "text/csv";

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    public static boolean hasCSVFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    public List<Producto> csvToProductos(InputStream is) {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {
    
            List<Producto> productos = new ArrayList<>();
    
            for (CSVRecord csvRecord : csvParser) {
                Producto producto = new Producto();
    
                try {
                    producto.setNombre(csvRecord.get("nombre"));
                    producto.setDescripcion(csvRecord.get("descripcion"));
                    producto.setPrecio(new BigDecimal(csvRecord.get("precio")));
                    producto.setStock(Integer.parseInt(csvRecord.get("stock")));
                    producto.setFechaCaducidad(LocalDate.parse(csvRecord.get("fechaCaducidad")));
                    producto.setActivo(Boolean.parseBoolean(csvRecord.get("activo")));
                    producto.setFechaRegistro(LocalDateTime.now());
    
                    // **Asignar CATEGORIA** (antes estaba buscando "categoria", ahora "categoriaId")
                    String categoriaIdStr = csvRecord.get("categoriaId");
                    if (categoriaIdStr != null && !categoriaIdStr.isEmpty()) {
                        try {
                            Long categoriaId = Long.parseLong(categoriaIdStr);
                            Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);
                            categoriaOpt.ifPresentOrElse(
                                    producto::setCategoria,
                                    () -> System.err.println("Advertencia: Categoría con ID " + categoriaId + " no encontrada")
                            );
                        } catch (NumberFormatException e) {
                            System.err.println("Formato inválido para Categoria ID: " + categoriaIdStr);
                        }
                    }
    
                    // **Asignar PROVEEDOR** (antes estaba buscando "proveedor", ahora "proveedorId")
                    String proveedorIdStr = csvRecord.get("proveedorId");
                    if (proveedorIdStr != null && !proveedorIdStr.isEmpty()) {
                        try {
                            Long proveedorId = Long.parseLong(proveedorIdStr);
                            Optional<Proveedor> proveedorOpt = proveedorRepository.findById(proveedorId);
                            proveedorOpt.ifPresentOrElse(
                                    producto::setProveedor,
                                    () -> System.err.println("Advertencia: Proveedor con ID " + proveedorId + " no encontrado")
                            );
                        } catch (NumberFormatException e) {
                            System.err.println("Formato inválido para Proveedor ID: " + proveedorIdStr);
                        }
                    }
    
                    productos.add(producto);
    
                } catch (Exception e) {
                    System.err.println("Error al procesar el CSV en la línea " + csvRecord.getRecordNumber() + ": " + e.getMessage());
                }
            }
            return productos;
    
        } catch (IOException e) {
            throw new RuntimeException("Error al leer el archivo CSV: " + e.getMessage());
        }
    }
    
}
