package com.back.back.utils;

import com.back.back.model.Producto;
import org.apache.commons.csv.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CSVHelper {

    public static String TYPE = "text/csv";

    public static boolean hasCSVFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    public static List<Producto> csvToProductos(InputStream is) {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            List<Producto> productos = new ArrayList<>();
            for (CSVRecord csvRecord : csvParser) {
                Producto producto = new Producto();
                
                // Convertir y asignar valores desde el CSV
                producto.setNombre(csvRecord.get("nombre"));
                producto.setDescripcion(csvRecord.get("descripcion"));
                producto.setPrecio(new BigDecimal(csvRecord.get("precio")));
                producto.setStock(Integer.parseInt(csvRecord.get("stock")));
                producto.setFechaCaducidad(LocalDate.parse(csvRecord.get("fechaCaducidad")));
                producto.setActivo(Boolean.parseBoolean(csvRecord.get("activo")));
                
                // Fecha de registro se asigna automáticamente
                producto.setFechaRegistro(LocalDateTime.now());

                productos.add(producto);
            }
            return productos;

        } catch (IOException e) {
            throw new RuntimeException("Error al leer el archivo CSV: " + e.getMessage());
        }
    }
}
