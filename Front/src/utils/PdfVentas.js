import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '@/assets/images/LogoTatis.png';

export function generarReportePDF(ventas, historialVentas, fechaInicio, fechaFin, usuarioData) {
  const totalVentasReporte = ventas.reduce((sum, v) => sum + v.total, 0);
  const cantidadVentas = ventas.length;
  const totalVentasDia = historialVentas
    .filter(v => new Date(v.fechaVenta).toLocaleDateString() === new Date().toLocaleDateString())
    .reduce((sum, v) => sum + v.total, 0);

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let startY = 20;

  pdf.addImage(Logo, 'PNG', 14, startY, 40, 40);
  startY += 45; // Espacio después del logo

  // --- Encabezado Principal ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(40, 40, 40);
  pdf.text("Tatis Cremería 2025", pageWidth / 2, startY, { align: 'center' });
  startY += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Reporte de Ventas", pageWidth / 2, startY, { align: 'center' });
  startY += 15;

  // --- Datos Generales ---
  pdf.setFontSize(12);
  pdf.setTextColor(50, 50, 50);
  pdf.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 14, startY);
  startY += 8;
  pdf.text(`Generado por: ${usuarioData?.username || "Anonimo"}`, 14, startY);
  startY += 8;
  pdf.text(`Rol: ${usuarioData?.rol || "Desconocido"}`, 14, startY); // Mostrar rol
  startY += 8;
  pdf.text(`Período del Reporte: ${fechaInicio} a ${fechaFin}`, 14, startY);
  startY += 8;

  // --- Detalle de Ventas ---
  ventas.forEach(venta => {
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Venta ID: ${venta.ventaId} - Total: $${venta.total.toFixed(2)}`, 14, startY);
    startY += 6;
    pdf.text(`Vendedor: ${venta.usuario} | Rol: ${venta.rol}`, 14, startY);
    startY += 6;
    pdf.text(`Fecha: ${new Date(venta.fechaVenta).toLocaleString()}`, 14, startY);
    startY += 6;

    if (venta.detalles && venta.detalles.length > 0) {
      const columnas = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
      const filas = venta.detalles.map(det => [
        det.producto.nombre,
        det.cantidad.toString(),
        `$${det.precioUnitario.toFixed(2)}`,
        `$${det.subtotal.toFixed(2)}`
      ]);

      autoTable(pdf, {
        head: [columnas],
        body: filas,
        startY: startY + 5,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [63, 81, 181], textColor: 255 },
        margin: { left: 14, right: 14 }
      });

      startY = pdf.lastAutoTable.finalY + 10;
    } else {
      pdf.text("Sin productos registrados en esta venta.", 14, startY);
      startY += 10;
    }
  });

  // --- Resumen al final del documento ---
  pdf.setFontSize(12);
  pdf.setTextColor(50, 50, 50);
  pdf.text(`Total Ventas del Día: $${totalVentasDia.toFixed(2)}`, 14, startY);
  startY += 8;
  pdf.text(`Total Ventas del Reporte: $${totalVentasReporte.toFixed(2)}`, 14, startY);
  startY += 8;
  pdf.text(`Cantidad de Ventas: ${cantidadVentas}`, 14, startY);
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
  pdf.save(`Reporte_Ventas_${new Date().toLocaleDateString()}.pdf`);
}

