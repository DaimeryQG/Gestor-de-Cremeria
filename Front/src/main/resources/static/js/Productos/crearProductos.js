document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:8081"; // URL base de tu backend

    const categoriaSelect = document.getElementById("categoria");
    const proveedorSelect = document.getElementById("proveedor");
    const productoForm = document.getElementById("productoForm");
    const productosTableBody = document.getElementById("productosTableBody");

    const uploadCsvButton = document.getElementById("uploadCsvButton");
    const csvFileInput = document.getElementById("csvFile");

    const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    const modalEliminacion = new bootstrap.Modal(document.getElementById('modalEliminacion'));
    const modalConfirmacionEliminacion = new bootstrap.Modal(document.getElementById('modalConfirmacionEliminacion'));
    const modalConfirmacionCSV = new bootstrap.Modal(document.getElementById('modalConfirmacionCSV'));
    const modalConfirmacionEdicion = new bootstrap.Modal(document.getElementById('modalConfirmacionEdicion'));
    let productoAEliminar = null;

    // 🔹 Agregar una fila al principio de la tabla de productos
    function agregarFilaProducto(producto) {
        if (!producto || !producto.nombre) {
            console.error("⚠️ Producto inválido recibido del backend.", producto);
            return;
        }

        console.log("🧐 Agregando producto a la tabla:", producto);

        const fila = document.createElement("tr");
        fila.setAttribute("id", `producto-${producto.productoId}`);
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || "N/A"}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.stock || 0}</td>
            <td>${producto.categoria ? producto.categoria.nombre : "Sin Categoría"}</td>
            <td>${producto.proveedor ? producto.proveedor.nombre : "Sin Proveedor"}</td>
            <td>${producto.fechaCaducidad || "N/A"}</td>
            <td class="text-center">
                <button class="btn btn-danger btn-sm" onclick="confirmarEliminacion(${producto.productoId})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.productoId})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
            <td class="text-center">
                <button class="btn btn-${producto.activo ? "secondary" : "success"} btn-sm" 
                        onclick="toggleEstadoProducto(${producto.productoId}, ${producto.activo})">
                    <i class="fas fa-${producto.activo ? "ban" : "check"}"></i> 
                    ${producto.activo ? "Desactivar" : "Activar"}
                </button>
            </td>
        `;
        productosTableBody.prepend(fila);
    }

    window.toggleEstadoProducto = function (id, estadoActual) {
        fetch(`${API_URL}/productos/${id}/toggle`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: !estadoActual })
        })
            .then(response => response.json())
            .then(data => {
                console.log(`🔄 Estado cambiado a ${data.activo ? "Activo" : "Inactivo"}:`, data);
                actualizarFilaProducto(data);
            })
            .catch(error => console.error("❌ Error al cambiar estado:", error));
    };

    // 🔹 Cargar datos del producto en el formulario para editar
    window.editarProducto = function (id) {
        fetch(`${API_URL}/productos/${id}`)
            .then(response => response.json())
            .then(producto => {
                console.log("✏️ Cargando producto para edición:", producto);

                document.getElementById("nombre").value = producto.nombre;
                document.getElementById("descripcion").value = producto.descripcion;
                document.getElementById("precio").value = producto.precio;
                document.getElementById("stock").value = producto.stock;
                document.getElementById("fecha_caducidad").value = producto.fechaCaducidad;
                document.getElementById("categoria").value = producto.categoria ? producto.categoria.categoriaId : "";
                document.getElementById("proveedor").value = producto.proveedor ? producto.proveedor.proveedorId : "";
                document.getElementById("activo").checked = producto.activo;

                // Guardar el ID del producto en un atributo para saber si es edición
                productoForm.setAttribute("data-producto-id", id);
            })
            .catch(error => console.error("❌ Error al cargar producto:", error));
    };

    // 🔹 Guardar o actualizar un producto
    productoForm.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const formData = new FormData(productoForm);
        const producto = Object.fromEntries(formData.entries());
    
        producto.activo = document.getElementById("activo").checked;
        producto.categoria = producto.categoria ? { categoriaId: Number(producto.categoria) } : null;
        producto.proveedor = producto.proveedor ? { proveedorId: Number(producto.proveedor) } : null;
        producto.fechaCaducidad = document.getElementById("fecha_caducidad").value;
    
        const productoId = productoForm.getAttribute("data-producto-id");
    
        const method = productoId ? "PUT" : "POST";
        const url = productoId ? `${API_URL}/productos/${productoId}` : `${API_URL}/productos`;
    
        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
        })
        .then(response => response.json())
        .then(data => {
            console.log(`✅ Producto ${productoId ? "actualizado" : "creado"}:`, data);
    
            if (productoId) {
                actualizarFilaProducto(data);
                modalConfirmacionEdicion.show(); // ✅ Mostrar modal de confirmación de edición
            } else {
                agregarFilaProducto(data);
                modalConfirmacion.show(); // ✅ Mostrar modal de confirmación de creación
            }
    
            // Resetear el formulario
            productoForm.reset();
            productoForm.removeAttribute("data-producto-id");
        })
        .catch(error => {
            console.error("❌ Error al guardar producto:", error);
            alert("⚠️ Error al guardar el producto. Revisa la consola.");
        });
    });

    // 🔹 Actualizar la fila de la tabla después de editar
    function actualizarFilaProducto(producto) {
        const fila = document.getElementById(`producto-${producto.productoId}`);
        if (!fila) return;

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || "N/A"}</td>
            <td>${producto.precio || 0}</td>
            <td>${producto.stock || 0}</td>
            <td>${producto.categoria?.nombre || "Sin Categoría"}</td>
            <td>${producto.proveedor?.nombre || "Sin Proveedor"}</td>
            <td>${producto.fechaCaducidad || "N/A"}</td>
            <td class="text-center">
                <button class="btn btn-danger btn-sm" onclick="confirmarEliminacion(${producto.productoId})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.productoId})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
            <td class="text-center">
                <button class="btn btn-${producto.activo ? "secondary" : "success"} btn-sm" 
                        onclick="toggleEstadoProducto(${producto.productoId}, ${producto.activo})">
                    <i class="fas fa-${producto.activo ? "ban" : "check"}"></i> 
                    ${producto.activo ? "Desactivar" : "Activar"}
                </button>
            </td>
        `;
    }

    window.confirmarEliminacion = function (id) {
        productoAEliminar = id;
        modalEliminacion.show();
    };

    // 🔹 Eliminar producto
    window.eliminarProducto = function () {
        if (!productoAEliminar) return;
    
        fetch(`${API_URL}/productos/${productoAEliminar}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al eliminar el producto");
                }
                return response.text(); // ⚠️ Usa `text()` en lugar de `json()`
            })
            .then(() => {
                document.getElementById(`producto-${productoAEliminar}`).remove();
                modalEliminacion.hide(); // Cierra el modal de confirmación
                modalConfirmacionEliminacion.show(); // Muestra el modal de éxito
            })
            .catch(error => console.error("❌ Error al eliminar producto:", error));
    };

    // 🔹 Cargar productos al inicio
    function cargarProductos() {
        fetch(`${API_URL}/productos`)
            .then(response => response.json())
            .then(productos => {
                productosTableBody.innerHTML = "";
                productos.forEach(producto => agregarFilaProducto(producto));
            })
            .catch(error => console.error("❌ Error al cargar productos:", error));
    }

    // 🔹 Cargar categorías
    function cargarCategorias() {
        fetch(`${API_URL}/categorias`)
            .then(response => response.json())
            .then(categorias => {
                categoriaSelect.innerHTML = '<option value="">Sin Categoría</option>';
                categorias.forEach(categoria => {
                    categoriaSelect.innerHTML += `<option value="${categoria.categoriaId}">${categoria.nombre}</option>`;
                });
            })
            .catch(error => console.error("❌ Error al cargar categorías:", error));
    }

    // 🔹 Cargar proveedores
    function cargarProveedores() {
        fetch(`${API_URL}/proveedores`)
            .then(response => response.json())
            .then(proveedores => {
                proveedorSelect.innerHTML = '<option value="">Sin Proveedor</option>';
                proveedores.forEach(proveedor => {
                    proveedorSelect.innerHTML += `<option value="${proveedor.proveedorId}">${proveedor.nombre}</option>`;
                });
            })
            .catch(error => console.error("❌ Error al cargar proveedores:", error));
    }

    // 🔹 Subir CSV
    uploadCsvButton.addEventListener("click", function () {
        const file = csvFileInput.files[0];
        if (!file) {
            alert("⚠️ Por favor selecciona un archivo CSV.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        fetch(`${API_URL}/productos/upload-csv`, {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al subir archivo: ${response.statusText}`);
            }
            return response.text(); // Evita error si la respuesta está vacía
        })
        .then(() => {
            modalConfirmacionCSV.show(); // ✅ Mostrar el modal de confirmación
            $('#csvModal').modal('hide'); // Cierra el modal de carga de CSV
            csvFileInput.value = ""; // Limpiar el input
    
            // 🔄 Esperar 2 segundos antes de actualizar la lista de productos
            setTimeout(() => {
                cargarProductos(); // Recargar lista de productos
            }, 2000);
        })
        .catch(error => {
            console.error("❌ Error al subir archivo CSV:", error);
            alert("⚠️ Error al subir el archivo CSV. Revisa la consola para más detalles.");
        });
    });

    cargarCategorias();
    cargarProveedores();
    cargarProductos();
});
