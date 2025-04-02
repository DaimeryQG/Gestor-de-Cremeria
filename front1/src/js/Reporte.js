// services/ReporteGeneralService.js

import { getVentas } from '@/services/VentasService';
import { generarReportePDF } from '@/utils/PdfReporte';

export default {
  data() {
    const year = new Date().getFullYear();
    return {
      fechaInicio: `${year}-01-01`,
      fechaFin: `${year}-12-31`,
      historialVentas: []
    };
  },

  methods: {
    async generarPDF() {
      try {
        const ventas = await getVentas();

        if (!Array.isArray(ventas)) {
          alert("❌ Error: El formato de las ventas no es válido.");
          console.error("Ventas recibidas:", ventas);
          return;
        }

        // Filtrar ventas dentro del año seleccionado
        const inicio = new Date(`${this.fechaInicio}T00:00:00`);
        const fin = new Date(`${this.fechaFin}T23:59:59`);
        const ventasFiltradas = ventas.filter(v => {
          const fechaVenta = new Date(v.fechaVenta);
          return fechaVenta >= inicio && fechaVenta <= fin;
        });

        this.historialVentas = ventas;

        const usuarioData = JSON.parse(sessionStorage.getItem('usuario'));

        generarReportePDF(
          ventasFiltradas,
          this.fechaInicio,
          this.fechaFin,
          usuarioData,
          this.historialVentas
        );
      } catch (error) {
        alert("⚠️ Error al generar el reporte: " + error.message);
        console.error(error);
      }
    }
  }
};
