import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '@/assets/images/LogoTatis.png';

export function generarProductosPDF(productos, usuarioActual, campo, valor) {
  const totalProductos = productos.length;
  const totalPrecio = productos.reduce((sum, product) => sum + product.precio, 0);

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let startY = 20;

  // --- Agregar Logo en formato PNG con transparencia ---
  pdf.addImage(Logo, 'PNG', 14, startY, 40, 40);
  startY += 45; // Espacio después del logo

  // --- Generar Encabezado ---
  generarEncabezado(pdf, startY, usuarioActual); // Llamada a la función con datos de usuario

  // --- Función Generar Encabezado ---
  function generarEncabezado(pdf, startY, usuarioActual) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(40, 40, 40);
    pdf.text("Tatis Cremería 2025", pageWidth / 2, startY, { align: 'center' });
    startY += 10;
    pdf.setFontSize(16);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Reporte de Productos", pageWidth / 2, startY, { align: 'center' });
    startY += 15;

    // --- Datos Generales ---
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 14, startY);
    startY += 8;
    pdf.text(`Generado por: ${usuarioActual?.username || "Anónimo"}`, 14, startY);
    startY += 8;
    pdf.text(`Rol: ${usuarioActual?.rol || "Desconocido"}`, 14, startY); // Mostrar rol
    startY += 8;
    pdf.text(`Filtro aplicado: ${campo} = ${valor}`, 14, startY);
    startY += 8;

    // --- Detalle de Productos ---
    const columnas = [
      "ID", 
      "Nombre", 
      "Descripción", 
      "Precio", 
      "Stock", 
      "Categoría", 
      "Proveedor", 
      "Fecha de Caducidad", 
      "Activo"
    ];

    const filas = productos.map(product => [
      product.productoId,
      product.nombre,
      product.descripcion,
      `$${product.precio.toFixed(2)}`,
      product.stock,
      product.categoria?.nombre || '',
      product.proveedor?.nombre || '',
      product.fechaCaducidad ? new Date(product.fechaCaducidad).toLocaleDateString() : '',
      product.activo ? 'Activo' : 'Inactivo'
    ]);

    autoTable(pdf, {
      head: [columnas],
      body: filas,
      startY: startY,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    startY = pdf.lastAutoTable.finalY + 10;

    // --- Resumen al final del documento ---
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Total de Productos: ${totalProductos}`, 14, startY);
    startY += 8;
    pdf.text(`Valor Total de los Productos: $${totalPrecio.toFixed(2)}`, 14, startY);
    startY += 12;

    // --- Footer / Paginación ---
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Página ${i} de ${pageCount}`, 14, pdf.internal.pageSize.getHeight() - 10);
    }

    // Guardar PDF
    pdf.save(`Reporte_Productos_${new Date().toLocaleDateString()}.pdf`);
  }
}
