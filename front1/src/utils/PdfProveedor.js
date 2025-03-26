import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '@/assets/images/LogoTatis.png';

export function generarProveedoresPDF(proveedores, usuarioActual, campo, valor) {
  const pdf = new jsPDF('p', 'mm', 'a4'); // Ajustar la orientación a vertical ('p' para vertical)
  let startY = 20;

  // --- Agregar Logo ---
    pdf.addImage(Logo, 'PNG', 14, startY, 40, 40);
      startY += 45; // Espacio después del logo

  // 🔷 Encabezado principal
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.text('Tatis Cremería 2025', pageWidth / 2, startY, { align: 'center' }); // Centrado horizontal
  startY += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Reporte de Proveedores', pageWidth / 2, startY, { align: 'center' });
  startY += 10;
  
  pdf.setFontSize(10);
  pdf.text(`Generado por: ${usuarioActual?.username || 'Anónimo'}`, 14, startY);
  startY += 6;
  pdf.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 14, startY);
  startY += 6;
  pdf.text(`Filtro aplicado: ${campo} = ${valor}`, 14, startY);
  startY += 10;

  // 🔷 Tabla de proveedores
  const columnas = [
    "ID", 
    "Nombre", 
    "Correo", 
    "Teléfono", 
    "Dirección", 
    "Estado", 
    "Activo"
  ];

  const filas = proveedores.map(proveedor => [
    proveedor.proveedorId,
    proveedor.nombre,
    proveedor.correo,
    proveedor.telefono,
    proveedor.direccion,
    proveedor.estado === 1 ? 'Activo' : 'Inactivo',  // Mapeamos el estado (1=Activo, 0=Inactivo)
    proveedor.activo ? 'Activo' : 'Inactivo'
  ]);

  autoTable(pdf, {
    head: [columnas],
    body: filas,
    startY: startY,
    theme: 'striped',
    styles: { fontSize: 9 },
    margin: { left: 10, right: 10 }
  });

  startY = pdf.lastAutoTable.finalY + 10; // Actualiza la posición después de la tabla

  // 🔷 Resumen de la información
  const totalProveedores = proveedores.length;
  const totalActivos = proveedores.filter(proveedor => proveedor.activo).length;
  const totalInactivos = totalProveedores - totalActivos;

  pdf.setFontSize(12);
  pdf.setTextColor(50, 50, 50);
  pdf.text(`Total de Proveedores: ${totalProveedores}`, 14, startY);
  startY += 8;
  pdf.text(`Total Activos: ${totalActivos}`, 14, startY);
  startY += 8;
  pdf.text(`Total Inactivos: ${totalInactivos}`, 14, startY);

  // 🔷 Footer / Paginación
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Página ${i} de ${pageCount}`, 14, pdf.internal.pageSize.getHeight() - 10);
  }

  // 🔷 Descargar PDF
  pdf.save('Reporte_Proveedores.pdf');
}
