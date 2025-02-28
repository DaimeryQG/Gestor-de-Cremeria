document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:8081"; // URL base de tu backend

    const categoriaSelect = document.getElementById("categoria");
    const proveedorSelect = document.getElementById("proveedor");
    const productoForm = document.getElementById("productoForm");
    const productosTableBody = document.getElementById("productosTableBody");

    const uploadCsvButton = document.getElementById("uploadCsvButton");
    const csvFileInput = document.getElementById("csvFile");

    // 🔹 Agregar una fila a la tabla de productos
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
            <td>${producto.precio || 0}</td>
            <td>${producto.stock || 0}</td>
            <td>${producto.categoria?.nombre || "Sin Categoría"}</td>
            <td>${producto.proveedor?.nombre || "Sin Proveedor"}</td>
            <td>${producto.fechaCaducidad || "N/A"}</td>
            <td class="text-center">
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.productoId})">
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
        productosTableBody.appendChild(fila);
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
            productoId ? actualizarFilaProducto(data) : agregarFilaProducto(data);
            productoForm.reset();
            productoForm.removeAttribute("data-producto-id");
        })
        .catch(error => {
            console.error("❌ Error al guardar producto:", error);
            alert("⚠️ Error al guardar el producto: " + error.message);
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
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.productoId})">
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

    // 🔹 Eliminar producto
    window.eliminarProducto = function (id) {
        fetch(`${API_URL}/productos/${id}`, { method: "DELETE" })
            .then(() => {
                alert("🗑️ Producto eliminado.");
                document.getElementById(`producto-${id}`).remove();
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
        .then(response => response.text())
        .then(message => {
            alert(`✅ ${message}`);
            $('#csvModal').modal('hide'); // Cerrar modal
            csvFileInput.value = ""; // Limpiar input
            cargarProductos(); // Refrescar la lista de productos
        })
        .catch(error => console.error("❌ Error al subir archivo CSV:", error));
    });

    cargarCategorias();
    cargarProveedores();
    cargarProductos();
});
