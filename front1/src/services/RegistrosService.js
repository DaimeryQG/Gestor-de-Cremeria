const API_URL = 'http://localhost:8081';

export async function buscarRegistros(campo, valor) {
  const bodyData = {
    campo: campo,
    valor: valor
  };
  
  const response = await fetch(`${API_URL}/registros/buscar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData)
  });

  if (!response.ok) throw new Error('Error en la búsqueda.');
  return await response.json();
}

export async function crearRegistro(registro) {
  const response = await fetch(`${API_URL}/registros/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al crear registro.');
  }
  return { mensaje: 'Registro creado correctamente.' }; // No hay body en backend, devolvemos manualmente
}

export async function actualizarRegistro(id, updatedData) {
  const response = await fetch(`${API_URL}/registros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al actualizar.');
  }
  return { mensaje: 'Registro actualizado correctamente.' }; // No hay body en backend
}

export async function eliminarRegistro(id) {
  const response = await fetch(`${API_URL}/registros/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al eliminar.');
  }
  return { mensaje: 'Registro eliminado correctamente.' }; // No hay body
}

export async function activarRegistro(id) {
  const response = await fetch(`${API_URL}/registros/activar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al activar usuario.');
  return { mensaje: 'Usuario activado correctamente.' };
}

export async function desactivarRegistro(id) {
  const response = await fetch(`${API_URL}/registros/desactivar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al desactivar usuario.');
  return { mensaje: 'Usuario desactivado correctamente.' };
}

export async function obtenerTodos() {
  try {
    const response = await fetch(`${API_URL}/registros`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/*
export async function registrarVenta(productos) {
  try {
    const usuarioData = JSON.parse(sessionStorage.getItem('usuario'));
    if (!usuarioData) throw new Error("Usuario no autenticado");

    const detalles = productos.map(prod => ({
      producto: { productoId: prod.productoId },
      cantidad: prod.cantidad,
      precioUnitario: prod.precioUnitario
    }));

    const ventaData = {
      usuario: usuarioData.username,
      rol: usuarioData.rol,
      detalles: detalles
    };

    const response = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ventaData)
    });

    if (!response.ok) throw new Error('Error al registrar venta');

    return await response.json();
  } catch (error) {
    console.error("Error en venta:", error);
    throw error;
  }
}
*/

export async function buscarDinamico(filtros) {
  const response = await fetch(`${API_URL}/registros/buscar/dinamico`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });

  if (!response.ok) throw new Error('Error en la búsqueda dinámica.');
  return await response.json();
}