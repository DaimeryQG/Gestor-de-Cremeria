document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:8081"; // URL base del backend

    // Elementos del DOM
    const productoSelect = document.getElementById("producto");
    const cantidadInput = document.getElementById("cantidad");
    const detalleVentaBody = document.getElementById("detalleVentaBody");
    const totalVentaSpan = document.getElementById("totalVenta");
    const registrarVentaBtn = document.getElementById("registrarVenta");
    const ventasTableBody = document.getElementById("ventasTableBody");
    const modalConfirmacionVenta = new bootstrap.Modal(document.getElementById('modalConfirmacionVenta'));

    const toastAdvertencia = new bootstrap.Toast(document.getElementById("toastAdvertencia"));
    const toastErrorCantidad = new bootstrap.Toast(document.getElementById("toastErrorCantidad"));
    const toastErrorStock = new bootstrap.Toast(document.getElementById("toastErrorStock"));

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
        const cantidad = cantidadInput.value.trim();

        if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) {
            console.warn("❌ Error: Cantidad no válida.");
            mostrarToast('toastErrorCantidad'); // ✅ Mostrar Toast de Error
            return;
        }

        const cantidadNum = parseInt(cantidad);
        if (!productoId) {
            console.warn("⚠️ Error: Producto no seleccionado.");
            mostrarToast('toastAdvertencia'); // ✅ Mostrar Toast de Advertencia
            return;
        }

        const producto = productosDisponibles.find(p => p.productoId === productoId);
        if (!producto) {
            console.warn("⚠️ Error: Producto no encontrado.");
            mostrarToast('toastAdvertencia');
            return;
        }

        if (producto.stock < cantidadNum) {
            console.warn(`❌ Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`);
            mostrarToast('toastErrorStock'); // ✅ Mostrar Toast de Stock Insuficiente
            return;
        }

        const existente = detallesVenta.find(det => det.producto.productoId === productoId);
        if (existente) {
            if ((existente.cantidad + cantidadNum) > producto.stock) {
                console.warn(`❌ No puedes agregar más de ${producto.stock} unidades de ${producto.nombre}.`);
                mostrarToast('toastErrorStock');
                return;
            }
            existente.cantidad += cantidadNum;
            existente.subtotal = existente.cantidad * existente.precioUnitario;
        } else {
            detallesVenta.push({
                producto: { productoId },
                cantidad: cantidadNum,
                precioUnitario: producto.precio,
                subtotal: producto.precio * cantidadNum
            });
        }

        actualizarTablaVenta();
        actualizarTotal();
        cantidadInput.value = "";
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

    function mostrarToast(idToast) {
        const toastElement = document.getElementById(idToast);
        if (toastElement) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        } else {
            console.warn(`⚠️ No se encontró el toast con ID: ${idToast}`);
        }
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

                // ✅ Limpiar la lista de productos vendidos antes de agregar nuevos
                const productosVendidosLista = document.getElementById("productosVendidosLista");
                productosVendidosLista.innerHTML = "";

                // ✅ Agregar productos vendidos a la lista dentro del modal
                detallesVenta.forEach(detalle => {
                    const producto = productosDisponibles.find(p => p.productoId === detalle.producto.productoId);
                    if (producto) {
                        const item = document.createElement("li");
                        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                        item.innerHTML = `
                        <span>${producto.nombre} (${detalle.cantidad}x)</span>
                        <span class="badge badge-success badge-pill">$${detalle.subtotal.toFixed(2)}</span>
                    `;
                        productosVendidosLista.appendChild(item);
                    }
                });

                // ✅ Resetear los detalles de venta y actualizar la tabla
                detallesVenta = [];
                detalleVentaBody.innerHTML = "";
                actualizarTotal();

                // ✅ Mostrar el modal de confirmación con la lista de productos vendidos
                modalConfirmacionVenta.show();

                // ✅ Cargar ventas nuevamente para actualizar la lista
                cargarVentas();
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
        const fechaInicio = document.getElementById("fechaInicio").value;
        const fechaFin = document.getElementById("fechaFin").value;
    
        if (!fechaInicio || !fechaFin) {
            alert("⚠️ Debes seleccionar un rango de fechas para generar el reporte.");
            return;
        }
    
        fetch(`${API_URL}/reportes/ventas?inicio=${fechaInicio}&fin=${fechaFin}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then(ventas => {
                if (!Array.isArray(ventas)) {
                    console.error("❌ Respuesta inesperada de la API:", ventas);
                    alert("⚠️ Error al generar el reporte: Formato de datos incorrecto.");
                    return;
                }
    
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF();
                let startY = 20;
    
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(18);
                pdf.text("Reporte de Ventas", 14, startY);
                startY += 10;
                pdf.setFontSize(12);
                pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, startY);
                startY += 10;
                pdf.text(`Período: ${fechaInicio} - ${fechaFin}`, 14, startY);
                startY += 10;
    
                ventas.forEach(venta => {
                    pdf.setFontSize(14);
                    pdf.setTextColor(0, 128, 0); // Verde
                    pdf.text(`Venta ID: ${venta.ventaId} - Total: $${venta.total.toFixed(2)}`, 14, startY);
                    startY += 8;
                    pdf.setFontSize(10);
                    pdf.text(`Fecha: ${new Date(venta.fechaVenta).toLocaleString()}`, 14, startY);
                    startY += 6;
    
                    if (venta.detalles && venta.detalles.length > 0) {
                        const columnas = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
                        const filas = venta.detalles.map(detalle => [
                            detalle.producto.nombre,
                            detalle.cantidad,
                            `$${detalle.precioUnitario.toFixed(2)}`,
                            `$${detalle.subtotal.toFixed(2)}`
                        ]);
    
                        pdf.autoTable({
                            head: [columnas],
                            body: filas,
                            startY: startY + 5,
                            theme: "striped",
                            styles: { fontSize: 10 },
                            margin: { left: 14, right: 14 }
                        });
    
                        startY = pdf.lastAutoTable.finalY + 10;
                    } else {
                        pdf.setFont("helvetica", "italic");
                        pdf.text("Sin productos registrados en esta venta.", 14, startY);
                        startY += 10;
                    }
                });
    
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
