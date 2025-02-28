document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:8081"; // URL base de tu backend

    const categoriaSelect = document.getElementById("categoria");
    const proveedorSelect = document.getElementById("proveedor");
    const productoForm = document.getElementById("productoForm");
    const productosTableBody = document.getElementById("productosTableBody");

    const uploadCsvButton = document.getElementById("uploadCsvButton");
    const csvFileInput = document.getElementById("csvFile");

    // 🔹 Agregar una fila al principio de la tabla de productos
    function agregarFilaProducto(producto) {
        if (!producto || !producto.nombre) {
            console.error("⚠️ Error: Producto inválido recibido del backend.", producto);
            return;
        }

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || "N/A"}</td>
            <td>${producto.precio || 0}</td>
            <td>${producto.stock || 0}</td>
            <td>${producto.categoria?.nombre || "Sin Categoría"}</td>
            <td>${producto.proveedor?.nombre || "Sin Proveedor"}</td>
            <td>${producto.fechaCaducidad || "N/A"}</td>
            <td>${producto.activo ? "Sí" : "No"}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.productoId})">Eliminar</button>
            </td>
        `;

        // Insertar el nuevo producto al principio de la tabla
        productosTableBody.prepend(fila);
    }

    // 🔹 Enviar formulario para guardar producto
    productoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        if (nombre.length < 3) {
            alert("⚠️ El nombre del producto debe tener al menos 3 caracteres.");
            return;
        }

        const fechaCaducidad = document.getElementById("fecha_caducidad").value;
        if (!fechaCaducidad) {
            alert("⚠️ Debes ingresar una fecha de caducidad.");
            return;
        }

        const formData = new FormData(productoForm);
        const producto = Object.fromEntries(formData.entries());

        producto.activo = document.getElementById("activo").checked;
        producto.categoria = { categoriaId: parseInt(producto.categoria) };
        producto.proveedor = { proveedorId: parseInt(producto.proveedor) };
        producto.fechaCaducidad = fechaCaducidad;  

        console.log("📤 Enviando JSON:", JSON.stringify(producto));

        fetch(`${API_URL}/productos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Producto guardado correctamente:", data);
            agregarFilaProducto(data);
            productoForm.reset();

            // Mostrar el modal de éxito
            $("#successModal").modal("show");
        })
        .catch(error => {
            console.error("❌ Error al guardar producto:", error);
            alert("⚠️ Error al guardar el producto: " + error.message);
        });
    });

    // 🔹 Eliminar producto
    window.eliminarProducto = function (id) {
        fetch(`${API_URL}/productos/${id}`, { method: "DELETE" })
            .then(() => {
                alert("🗑️ Producto eliminado.");
                location.reload();
            })
            .catch(error => console.error("❌ Error al eliminar producto:", error));
    };

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

    // 🔹 Cargar datos al inicio
    function cargarCategorias() {
        fetch(`${API_URL}/categorias`)
            .then(response => response.json())
            .then(categorias => {
                categoriaSelect.innerHTML = "";
                categorias.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.categoriaId;
                    option.textContent = categoria.nombre;
                    categoriaSelect.appendChild(option);
                });
            })
            .catch(error => console.error("❌ Error al cargar categorías:", error));
    }

    function cargarProveedores() {
        fetch(`${API_URL}/proveedores`)
            .then(response => response.json())
            .then(proveedores => {
                proveedorSelect.innerHTML = "";
                proveedores.forEach(proveedor => {
                    const option = document.createElement("option");
                    option.value = proveedor.proveedorId;
                    option.textContent = proveedor.nombre;
                    proveedorSelect.appendChild(option);
                });
            })
            .catch(error => console.error("❌ Error al cargar proveedores:", error));
    }

    function cargarProductos() {
        fetch(`${API_URL}/productos`)
            .then(response => response.json())
            .then(productos => {
                productosTableBody.innerHTML = "";
                productos.forEach(producto => agregarFilaProducto(producto));
            })
            .catch(error => console.error("❌ Error al cargar productos:", error));
    }

    cargarCategorias();
    cargarProveedores();
    cargarProductos();
});
