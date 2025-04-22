const API_URL = 'http://localhost:8081';

export async function loginRequest(username, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Credenciales incorrectas');

    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}
