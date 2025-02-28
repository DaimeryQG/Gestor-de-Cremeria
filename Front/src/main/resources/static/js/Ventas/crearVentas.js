document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:8081"; // URL base del backend

    // Elementos del DOM
    const productoSelect = document.getElementById("producto");
    const cantidadInput = document.getElementById("cantidad");
    const detalleVentaBody = document.getElementById("detalleVentaBody");
    const totalVentaSpan = document.getElementById("totalVenta");
    const registrarVentaBtn = document.getElementById("registrarVenta");
    const ventasTableBody = document.getElementById("ventasTableBody");

    let detallesVenta = [];
    let productosDisponibles = [];

    /** 🔹 Cargar productos desde la API */
    function cargarProductos() {
        fetch(`${API_URL}/productos`)
            .then(response => response.json())
            .then(productos => {
                productosDisponibles = productos;
                productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
                productos.forEach(producto => {
                    const option = document.createElement("option");
                    option.value = producto.productoId;
                    option.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
                    productoSelect.appendChild(option);
                });
            })
            .catch(error => console.error("❌ Error al cargar productos:", error));
    }

    /** 🔹 Agregar producto a la lista de venta */
    document.getElementById("agregarProducto").addEventListener("click", function () {
        const productoId = parseInt(productoSelect.value);
        const cantidad = parseInt(cantidadInput.value);

        if (!productoId || cantidad < 1) {
            alert("⚠️ Debes seleccionar un producto y una cantidad válida.");
            return;
        }

        const producto = productosDisponibles.find(p => p.productoId === productoId);
        if (!producto) {
            alert("⚠️ Producto no encontrado.");
            return;
        }

        // Verificar si el producto ya está en la lista y actualizar cantidad en lugar de duplicarlo
        const existente = detallesVenta.find(det => det.producto.productoId === productoId);
        if (existente) {
            existente.cantidad += cantidad;
            existente.subtotal = existente.cantidad * existente.precioUnitario;
        } else {
            detallesVenta.push({
                producto: { productoId },
                cantidad,
                precioUnitario: producto.precio,
                subtotal: producto.precio * cantidad
            });
        }

        actualizarTablaVenta();
        actualizarTotal();
    });

    /** 🔹 Actualizar tabla de detalle de venta */
    function actualizarTablaVenta() {
        detalleVentaBody.innerHTML = "";

        detallesVenta.forEach((detalle, index) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${productosDisponibles.find(p => p.productoId === detalle.producto.productoId).nombre}</td>
                <td>${detalle.cantidad}</td>
                <td>$${detalle.precioUnitario.toFixed(2)}</td>
                <td>$${detalle.subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm eliminar-item" data-index="${index}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;

            fila.querySelector(".eliminar-item").addEventListener("click", function () {
                eliminarProductoVenta(index);
            });

            detalleVentaBody.appendChild(fila);
        });
    }

    /** 🔹 Eliminar producto de la lista de venta */
    function eliminarProductoVenta(index) {
        detallesVenta.splice(index, 1);
        actualizarTablaVenta();
        actualizarTotal();
    }

    /** 🔹 Calcular total de la venta */
    function actualizarTotal() {
        const total = detallesVenta.reduce((sum, det) => sum + det.subtotal, 0);
        totalVentaSpan.textContent = total.toFixed(2);
    }

    /** 🔹 Registrar la venta en el backend */
    registrarVentaBtn.addEventListener("click", function () {
        if (detallesVenta.length === 0) {
            alert("⚠️ Agrega al menos un producto para realizar la venta.");
            return;
        }

        fetch(`${API_URL}/ventas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detallesVenta),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then(data => {
                console.log("✅ Venta registrada exitosamente:", data);
                detallesVenta = [];
                detalleVentaBody.innerHTML = "";
                actualizarTotal();
                $("#successModal").modal("show"); // Mostrar modal de éxito
                cargarVentas(); // Refrescar historial de ventas
            })
            .catch(error => {
                console.error("❌ Error al registrar la venta:", error);
                alert("⚠️ Error al registrar la venta: " + error.message);
            });
    });

    /** 🔹 Cargar ventas en la tabla de historial */
    function cargarVentas() {
        fetch(`${API_URL}/ventas`)
            .then(response => response.json())
            .then(ventas => {
                ventasTableBody.innerHTML = "";
                ventas.forEach(venta => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${venta.ventaId}</td>
                        <td>${new Date(venta.fechaVenta).toLocaleString()}</td>
                        <td>$${venta.total.toFixed(2)}</td>
                    `;
                    ventasTableBody.appendChild(fila);
                });
            })
            .catch(error => console.error("❌ Error al cargar ventas:", error));
    }

    /** 🔹 Generar y Descargar Reporte PDF */
    document.getElementById("descargarPDF").addEventListener("click", function () {
        fetch(`${API_URL}/ventas`)
            .then(response => response.json())
            .then(ventas => {
                if (ventas.length === 0) {
                    alert("⚠️ No hay ventas registradas para generar el reporte.");
                    return;
                }

                // Crear un nuevo documento PDF con jsPDF desde window.jspdf
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF();
                let startY = 20; // Posición inicial en el PDF

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(18);
                pdf.text("Reporte de Ventas", 14, startY);
                startY += 10;
                pdf.setFontSize(12);
                pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, startY);
                startY += 10;

                // Recorrer cada venta y agregar detalles al PDF
                ventas.forEach(venta => {
                    pdf.setFont("helvetica", "bold");
                    pdf.text(`Venta ID: ${venta.ventaId} - Total: $${venta.total.toFixed(2)}`, 14, startY);
                    startY += 8;
                    pdf.setFontSize(10);
                    pdf.text(`Fecha: ${new Date(venta.fechaVenta).toLocaleString()}`, 14, startY);
                    startY += 6;

                    // Verificar si la venta tiene productos
                    if (venta.detalles && venta.detalles.length > 0) {
                        const columnas = ["Nombre", "Precio", "Cantidad", "Precio Unitario", "Subtotal"];
                        const filas = venta.detalles.map(detalle => [
                            detalle.producto.nombre,
                            `$${detalle.producto.precio.toFixed(2)}`,
                            detalle.cantidad,
                            `$${detalle.precioUnitario.toFixed(2)}`,
                            `$${detalle.subtotal.toFixed(2)}`
                        ]);

                        // Agregar tabla con detalles de productos vendidos
                        pdf.autoTable({
                            head: [columnas],
                            body: filas,
                            startY: startY + 5,
                            theme: "striped",
                            styles: { fontSize: 10 },
                            margin: { left: 14, right: 14 }
                        });

                        startY = pdf.lastAutoTable.finalY + 10; // Ajustar para la siguiente venta
                    } else {
                        pdf.setFont("helvetica", "italic");
                        pdf.text("Sin productos registrados en esta venta.", 14, startY);
                        startY += 10;
                    }
                });

                // Descargar el archivo PDF
                pdf.save("Reporte_Ventas.pdf");
            })
            .catch(error => {
                console.error("❌ Error al generar el PDF:", error);
                alert("⚠️ Error al generar el reporte en PDF.");
            });
    });


    /** 🔹 Cargar datos al inicio */
    cargarProductos();
    cargarVentas();
});
