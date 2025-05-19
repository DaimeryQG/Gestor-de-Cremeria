import { ref, onMounted } from 'vue';
import { getProductos, getVentas, postVenta, getReporteVentas } from '@/services/VentasService.js';
import { generarReportePDF } from '@/utils/PdfVentas.js';

export default function useVentas() {
  const productos = ref([]);
  const productoSeleccionado = ref('');
  const cantidad = ref(1);
  const detallesVenta = ref([]);
  const totalVenta = ref(0);

  const historialVentas = ref([]);
  const fechaInicio = ref('');
  const fechaFin = ref('');

  const showSuccessModal = ref(false);
  const ventaSeleccionada = ref(null);

  const cargarProductos = () => {
    getProductos()
      .then(data => productos.value = data)
      .catch(err => console.error(err));
  };

  const cargarVentas = () => {
    getVentas()
      .then(data => historialVentas.value = data)
      .catch(err => console.error(err));
  };

  const agregarProducto = () => {
    if (!productoSeleccionado.value || cantidad.value <= 0) {
      alert("⚠️ Seleccione un producto válido y una cantidad mayor a 0.");
      return;
    }

    if (productoSeleccionado.value.stock < cantidad.value) {
      alert("❌ Stock insuficiente.");
      return;
    }

    const existente = detallesVenta.value.find(det => det.producto.productoId === productoSeleccionado.value.productoId);

    if (existente) {
      if ((existente.cantidad + cantidad.value) > productoSeleccionado.value.stock) {
        alert("❌ No puedes agregar más cantidad que el stock disponible.");
        return;
      }
      existente.cantidad += cantidad.value;
      existente.subtotal = existente.cantidad * existente.precioUnitario;
    } else {
      detallesVenta.value.push({
        producto: productoSeleccionado.value,
        cantidad: cantidad.value,
        precioUnitario: productoSeleccionado.value.precio,
        subtotal: productoSeleccionado.value.precio * cantidad.value
      });
    }

    actualizarTotal();
    cantidad.value = 1;
  };

  const eliminarProducto = (index) => {
    detallesVenta.value.splice(index, 1);
    actualizarTotal();
  };

  const actualizarTotal = () => {
    totalVenta.value = detallesVenta.value.reduce((sum, det) => sum + det.subtotal, 0);
  };

  const registrarVenta = () => {
    if (detallesVenta.value.length === 0) {
      alert("⚠️ Agrega al menos un producto.");
      return;
    }

    const usuarioData = JSON.parse(sessionStorage.getItem('usuario'));
    console.log(sessionStorage.getItem('usuario'));

    const ventaRequest = {
      usuario: usuarioData?.username || "ANONIMO",
      rol: usuarioData?.rol || "SIN_ROL",
      detalles: detallesVenta.value.map(det => ({
        producto: { productoId: det.producto.productoId },
        cantidad: det.cantidad,
        precioUnitario: det.precioUnitario
      }))
    };

    postVenta(ventaRequest)
      .then(() => {
        detallesVenta.value = [];
        totalVenta.value = 0;
        cargarVentas();
        showSuccessModal.value = true;
      })
      .catch(err => alert(err.message));
  };

  const generarPDF = () => {
    if (!fechaInicio.value || !fechaFin.value) {
      alert("⚠️ Selecciona un rango de fechas.");
      return;
    }

    getReporteVentas(fechaInicio.value, fechaFin.value)
      .then(ventas => {
        const usuarioData = JSON.parse(sessionStorage.getItem('usuario'));
        generarReportePDF(ventas, historialVentas.value, fechaInicio.value, fechaFin.value, usuarioData);
      })
      .catch(err => alert("Error al generar el reporte: " + err.message));
  };

  const verDetallesVenta = (venta) => {
    ventaSeleccionada.value = venta;
  };

  onMounted(() => {
    cargarProductos();
    cargarVentas();
  });

  return {
    productos,
    productoSeleccionado,
    cantidad,
    detallesVenta,
    totalVenta,
    historialVentas,
    fechaInicio,
    fechaFin,
    showSuccessModal,
    ventaSeleccionada,
    agregarProducto,
    eliminarProducto,
    registrarVenta,
    generarPDF,
    verDetallesVenta
  };
}
