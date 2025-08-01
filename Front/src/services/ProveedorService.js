export async function obtenerProveedores() {
  try {
    const response = await fetch('/proveedores', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al obtener los proveedores');

    const proveedores = await response.json();
    return proveedores;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function crearProveedor(proveedor) {
  try {
    const response = await fetch('/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedor),
    });

    if (!response.ok) throw new Error('Error al crear proveedor');

    const nuevoProveedor = await response.json();
    return nuevoProveedor;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function obtenerProveedorPorId(id) {
  try {
    const response = await fetch(`/proveedores/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al obtener el proveedor por ID');

    const proveedor = await response.json();
    return proveedor;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function actualizarProveedor(id, proveedor) {
  try {
    const response = await fetch(`/proveedores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedor),
    });

    if (!response.ok) throw new Error('Error al actualizar proveedor');

    const proveedorActualizado = await response.json();
    return proveedorActualizado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function eliminarProveedor(id) {
  try {
    const response = await fetch(`/proveedores/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al eliminar proveedor');

    const respuesta = await response.json();
    return respuesta;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function activarProveedor(id) {
  try {
    const response = await fetch(`/proveedores/activar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al activar proveedor');

    const proveedorActivado = await response.json();
    return proveedorActivado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function desactivarProveedor(id) {
  try {
    const response = await fetch(`/proveedores/desactivar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al desactivar proveedor');

    const proveedorDesactivado = await response.json();
    return proveedorDesactivado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function buscarProveedorDinamico(filtros) {
  try {
    const response = await fetch(`/proveedores/buscar/dinamico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros),
    });

    if (!response.ok) throw new Error('Error al buscar proveedores dinámicamente');

    const proveedores = await response.json();
    return proveedores;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
