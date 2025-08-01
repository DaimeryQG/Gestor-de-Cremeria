export async function enviarFeedback(feedback) {
  try {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Solicitud no válida`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al enviar el feedback:', error);
    throw error;
  }
}
