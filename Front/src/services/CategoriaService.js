const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerCategorias() {
  const url = `${API_URL}/categorias`;
  console.log("URL fetch categorias:", url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      }
    });

    const text = await response.text();
    console.log("Respuesta raw:", text);

    if (!response.ok) {
      throw new Error('Error inesperado del servidor:\n' + text);
    }

    const categorias = JSON.parse(text);
    return categorias;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
}

export async function crearCategoria(categoria) {
  const url = `${API_URL}/categorias`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      },
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
