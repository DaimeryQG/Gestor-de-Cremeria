export async function crearRegistro(registro) {
  const response = await fetch('/registros/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al crear registro.');
  }
  return { mensaje: 'Registro creado correctamente.' };
}

export async function actualizarRegistro(id, updatedData) {
  const response = await fetch(`/registros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al actualizar.');
  }
  return { mensaje: 'Registro actualizado correctamente.' };
}

export async function eliminarRegistro(id) {
  const response = await fetch(`/registros/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al eliminar.');
  }
  return { mensaje: 'Registro eliminado correctamente.' };
}

export async function activarRegistro(id) {
  const response = await fetch(`/registros/activar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al activar usuario.');
  return { mensaje: 'Usuario activado correctamente.' };
}

export async function desactivarRegistro(id) {
  const response = await fetch(`/registros/desactivar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al desactivar usuario.');
  return { mensaje: 'Usuario desactivado correctamente.' };
}

export async function obtenerTodos() {
  try {
    const response = await fetch('/registros', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
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

export async function buscarDinamico(filtros) {
  const response = await fetch('/registros/buscar/dinamico', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });

  if (!response.ok) throw new Error('Error en la búsqueda dinámica.');
  return await response.json();
}
