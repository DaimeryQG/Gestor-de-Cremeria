<template>
  <!-- El formulario siempre se muestra, pero se oculta si ya se envió el feedback -->
  <div class="feedback-container" v-if="!feedbackEnviado">
    <div class="feedback-card">
      <h2>📝 Déjanos tu Puntuación</h2>
      <form @submit.prevent="enviarFeedbackFormulario">
        <!-- Puntuación con caras -->
        <div class="form-group">
          <label for="puntaje">Puntuación:</label>
          <div class="rating">
            <span 
              v-for="i in 5" 
              :key="i" 
              :class="['rating-face', i === feedback.puntaje ? 'selected' : '', i <= feedback.puntaje ? 'active' : '']"
              @click="setPuntuacion(i)">
              <span v-if="i === 1">😡</span>
              <span v-if="i === 2">😟</span>
              <span v-if="i === 3">😐</span>
              <span v-if="i === 4">🙂</span>
              <span v-if="i === 5">😄</span>
            </span>
          </div>
        </div>

        <div class="button-group">
          <button type="submit">Enviar</button>
          <button type="button" @click="cerrarFormulario">Cerrar</button>
        </div>
      </form>
      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { enviarFeedback } from '@/services/FeedbackService';

// Estado para saber si el feedback fue enviado
const feedbackEnviado = ref(false);
const feedback = ref({
  puntaje: 0,
});

const mensaje = ref('');

// Función que se ejecuta cuando el formulario es enviado
const enviarFeedbackFormulario = async () => {
  if (feedback.value.puntaje < 1 || feedback.value.puntaje > 5) {
    mensaje.value = '❌ La puntuación debe estar entre 1 y 5.';
    return;
  }

  try {
    // Aquí se envía el feedback a la API
    const data = await enviarFeedback(feedback.value);
    mensaje.value = '✅ ¡Gracias por tu feedback!';
    feedbackEnviado.value = true; // Marcamos que el feedback fue enviado

    // Aquí puedes cerrar el formulario si ya se envió el feedback
  } catch (error) {
    console.error('Error:', error);
    mensaje.value = '❌ Error al enviar el feedback.';
  }
};

// Función para seleccionar la puntuación
const setPuntuacion = (valor) => {
  feedback.value.puntaje = valor;
};

// Función para cerrar el formulario (en caso de que el usuario lo desee)
const cerrarFormulario = () => {
  feedbackEnviado.value = true; // Al cerrar, marcamos que se envió el feedback
};
</script>

<style scoped>
.feedback-container {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
}

.feedback-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 300px;
}

.feedback-card h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #1E90FF;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0077cc;
}

.mensaje {
  margin-top: 1rem;
  font-weight: bold;
  color: green;
}

/* Estilos para las caras de puntuación */
.rating {
  display: flex;
  justify-content: space-around;
}

.rating-face {
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.rating-face:hover {
  transform: scale(1.2);
}

.rating-face.selected {
  transform: scale(1.5);
}

.rating-face.active {
  filter: brightness(1.1);
}
</style>
