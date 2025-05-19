// FeedbackService.js
export async function enviarFeedback(feedback) {
    try {
      const response = await fetch('http://localhost:8081/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Solicitud no válida`);
      }
  
      const data = await response.json(); // ✅ Esta es la única vez que usamos .json()
      return data;
    } catch (error) {
      console.error('Error al enviar el feedback:', error);
      throw error;
    }
  }
  