// utils/PdfReporteGeneral.js

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import Logo from '@/assets/images/LogoTatis.png';

export async function generarReportePDF(ventas, fechaInicio, fechaFin, usuario) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Encabezado principal con logo
  doc.addImage(Logo, 'PNG', 10, 10, 24, 24);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Tatis Cremería 2025', pageWidth / 2, y, { align: 'center' });
  y += 10;
  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text('Reporte de Ventas Anual', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Datos generales
  doc.setFontSize(12);
  doc.setTextColor(50);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, y); y += 6;
  doc.text(`Generado por: ${usuario?.username || 'Anónimo'}`, 14, y); y += 6;
  doc.text(`Rol: ${usuario?.rol || 'Sin rol'}`, 14, y); y += 6;
  doc.text(`Desde: ${fechaInicio} Hasta: ${fechaFin}`, 14, y); y += 10;

  // Procesamiento de datos
  const ventasPorMes = Array(12).fill(0);
  const cantidadPorMes = Array(12).fill(0);
  const productosTotales = {};
  let totalAnual = 0;

  ventas.forEach(v => {
    const fecha = new Date(v.fechaVenta);
    const mes = fecha.getMonth();
    ventasPorMes[mes] += v.total;
    cantidadPorMes[mes]++;
    totalAnual += v.total;

    v.detalles.forEach(det => {
      const nombre = det.producto.nombre;
      productosTotales[nombre] = (productosTotales[nombre] || 0) + det.cantidad;
    });
  });

  const productoMasVendido = Object.entries(productosTotales).sort((a, b) => b[1] - a[1])[0];

  // Resumen general
  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text('Resumen General del Año', 14, y); y += 8;

  doc.setFontSize(12);
  doc.setTextColor(50);
  doc.text(`Total generado en el año: $${totalAnual.toFixed(2)}`, 14, y); y += 6;
  if (productoMasVendido) {
    doc.text(`Producto más vendido: ${productoMasVendido[0]} (${productoMasVendido[1]} unidades)`, 14, y); y += 6;
  }
  y += 4;

  // Tabla de ventas por mes
  autoTable(doc, {
    startY: y,
    head: [['Mes', 'Ventas Totales ($)', 'Cantidad de Ventas', 'Porcentaje (%)']],
    body: ventasPorMes.map((monto, i) => {
      const mesNombre = new Date(2025, i).toLocaleString('es-MX', { month: 'long' });
      const porcentaje = totalAnual > 0 ? ((monto / totalAnual) * 100).toFixed(2) : '0.00';
      return [mesNombre, `$${monto.toFixed(2)}`, cantidadPorMes[i], `${porcentaje}%`];
    }),
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [63, 81, 181], textColor: 255 },
    margin: { left: 14, right: 14 }
  });

  // === GRÁFICAS EN LA MISMA PÁGINA NUEVA ===
  doc.addPage();
  y = 20;
  const scale = 2;

  // --- GRÁFICA DE BARRAS ---
  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text('Gráfica: Ventas por Mes', pageWidth / 2, y, { align: 'center' });

  const canvas1 = document.createElement('canvas');
  canvas1.width = 400 * scale;
  canvas1.height = 200 * scale;
  canvas1.style.width = '400px';
  canvas1.style.height = '200px';
  document.body.appendChild(canvas1);

  const etiquetas = Array.from({ length: 12 }, (_, i) => new Date(2025, i).toLocaleString('es-MX', { month: 'short' }));

  new Chart(canvas1, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Ventas por mes ($)',
        data: ventasPorMes,
        backgroundColor: '#FFB400'
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: value => `$${value}` }
        }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 800));
  const img1 = await html2canvas(canvas1, { scale });
  doc.addImage(img1.toDataURL('image/png'), 'PNG', 25, y + 10, pageWidth - 50, 60);
  document.body.removeChild(canvas1);

  // --- GRÁFICA DE PASTEL ---
  y += 80; // espacio debajo de la barra
  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text('Gráfica: Productos Más Vendidos', pageWidth / 2, y, { align: 'center' });

  const canvas2 = document.createElement('canvas');
  canvas2.width = 400 * scale;
  canvas2.height = 200 * scale;
  canvas2.style.width = '400px';
  canvas2.style.height = '200px';
  document.body.appendChild(canvas2);

  const labelsPie = Object.keys(productosTotales);
  const dataPie = Object.values(productosTotales);

  new Chart(canvas2, {
    type: 'pie',
    data: {
      labels: labelsPie,
      datasets: [{
        data: dataPie,
        backgroundColor: labelsPie.map((_, i) => `hsl(${i * 30}, 70%, 60%)`)
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'right' }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 800));
  const img2 = await html2canvas(canvas2, { scale });
  doc.addImage(img2.toDataURL('image/png'), 'PNG', 25, y + 10, pageWidth - 50, 60);
  document.body.removeChild(canvas2);

  // Footer paginación
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Página ${i} de ${totalPages}`, 14, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`Reporte_Ventas_${fechaInicio}_a_${fechaFin}.pdf`);
}
