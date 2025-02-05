// Obtener los productos desde la API del backend
fetch('http://localhost:3000/api/productos')
    .then(response => response.json())
    .then(data => {
        const productosLista = document.getElementById('productos-lista');
        productosLista.innerHTML = data.map(producto => `
            <div class="producto">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
            </div>
        `).join('');
    })
    .catch(err => console.error('Error al obtener los productos:', err));
