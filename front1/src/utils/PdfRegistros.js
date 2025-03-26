import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '@/assets/images/LogoTatis.png';

export function generarUsuariosPDF(usuarios, usuarioActual, campo, valor) {
  const pdf = new jsPDF('landscape'); // Cambiar la orientación a horizontal
  let startY = 20;

  // --- Agregar Logo ---
  pdf.addImage(Logo, 'PNG', 14, startY, 40, 40);
    startY += 45; // Espacio después del logo

  // --- Encabezado principal --- Tatis Cremería 2025
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(40, 40, 40);
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.text('Tatis Cremería 2025', pageWidth / 2, startY, { align: 'center' });
  startY += 20;
  
  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Reporte de Usuarios', pageWidth / 2, startY, { align: 'center' });
  startY += 20;

  // --- Datos Generales ---
  pdf.setFontSize(12);
  pdf.setTextColor(50, 50, 50);
  pdf.text(`Generado por: ${usuarioActual?.username || "Anónimo"} | Rol: ${usuarioActual?.rol || "Desconocido"}`, 14, startY);
  startY += 8;
  pdf.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 14, startY);
  startY += 8;
  pdf.text(`Filtro aplicado: ${campo} = ${valor}`, 14, startY);
  startY += 10;

  // --- Tabla de usuarios (sin ID, Dirección, País y Estado) ---
  const columnas = ["Nombre", "Correo", "Teléfono", "RFC", "CURP", "Username", "Rol", "Activo"];
  const filas = usuarios.map(user => [
    user.nombre,
    user.correo,
    user.telefono,
    user.rfc,
    user.curp,
    user.username,
    user.rol?.nombre || '',
    user.activo ? 'Activo' : 'Inactivo'
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

  // --- Resumen de la información ---
  const totalUsuarios = usuarios.length;
  const totalActivos = usuarios.filter(user => user.activo).length;
  const totalInactivos = totalUsuarios - totalActivos;

  pdf.setFontSize(12);
  pdf.setTextColor(50, 50, 50);
  pdf.text(`Total de Usuarios: ${totalUsuarios}`, 14, startY);
  startY += 8;
  pdf.text(`Total Activos: ${totalActivos}`, 14, startY);
  startY += 8;
  pdf.text(`Total Inactivos: ${totalInactivos}`, 14, startY);

  // --- Footer / Paginación ---
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Página ${i} de ${pageCount}`, 14, pdf.internal.pageSize.getHeight() - 10);
  }

  // 🔷 Descargar PDF
  pdf.save('Reporte_Usuarios.pdf');
}
