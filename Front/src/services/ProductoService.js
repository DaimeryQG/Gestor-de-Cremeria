export async function obtenerTodosProductos() {
  try {
    const response = await fetch('/productos', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }

    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function obtenerProductoPorId(id) {
  try {
    const response = await fetch(`/productos/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el producto con ID ${id}`);
    }

    const producto = await response.json();
    return producto;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function crearProducto(producto) {
  try {
    const response = await fetch('/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al crear el producto');
    }

    return { mensaje: 'Producto creado correctamente' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function actualizarProducto(id, producto) {
  try {
    const response = await fetch(`/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al actualizar el producto');
    }

    return { mensaje: 'Producto actualizado correctamente' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function eliminarProducto(id) {
  try {
    const response = await fetch(`/productos/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al eliminar el producto');
    }

    return { mensaje: 'Producto eliminado correctamente' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function subirCSV(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/productos/csv', {
      method: 'POST',
      body: formData
      // NO pongas headers 'Content-Type' porque el browser lo asigna automáticamente para multipart/form-data
    });

    if (!response.ok) {
      throw new Error('Error al cargar el archivo CSV');
    }

    return { mensaje: 'Productos cargados correctamente desde el archivo CSV' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function desactivarProducto(id) {
  try {
    const response = await fetch(`/productos/desactivar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Error al desactivar el producto');
    }

    return { mensaje: 'Producto desactivado correctamente' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function activarProducto(id) {
  try {
    const response = await fetch(`/productos/activar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Error al activar el producto');
    }

    return { mensaje: 'Producto activado correctamente' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function buscarProductos(campo, valor) {
  const bodyData = { campo, valor };

  try {
    const response = await fetch('/productos/buscar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) throw new Error('Error al buscar productos');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
