const API_URL = 'http://localhost:8081/categorias';

export async function obtenerCategorias() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al obtener las categorías');

    const categorias = await response.json();
    return categorias;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function crearCategoria(categoria) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    if (!response.ok) throw new Error('Error al crear categoría');

    const nuevaCategoria = await response.json();
    return nuevaCategoria;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
