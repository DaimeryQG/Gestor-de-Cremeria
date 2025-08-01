<template>
  <!-- El formulario se muestra solo si no se ha enviado -->
  <div class="feedback-container" v-if="!feedbackEnviado">
    <div class="feedback-card">
      <h2>📝 Déjanos tu Puntuación</h2>
      <form @submit.prevent="enviarFeedbackFormulario">
        <!-- Puntuación con caritas -->
        <div class="form-group">
          <label for="puntaje">Puntuación:</label>
          <div class="rating">
            <span v-for="i in 5" :key="i"
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

        <!-- Comentario -->
        <div class="form-group">
          <label for="comentario">Comentario:</label>
          <textarea
            id="comentario"
            v-model="feedback.comentario"
            placeholder="Escribe tu opinión aquí..."
            rows="4"
            style="width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid #ccc;"
          ></textarea>
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

const feedbackEnviado = ref(false);
const feedback = ref({
  puntaje: 0,
  comentario: '',
  nombreUsuario: '',
  rol: ''
});

const mensaje = ref('');

const enviarFeedbackFormulario = async () => {
  if (feedback.value.puntaje < 1 || feedback.value.puntaje > 5) {
    mensaje.value = '❌ La puntuación debe estar entre 1 y 5.';
    return;
  }

  if (!feedback.value.comentario.trim()) {
    mensaje.value = '❌ Por favor, escribe un comentario.';
    return;
  }

  // Obtener usuario desde sessionStorage
  const usuarioData = JSON.parse(sessionStorage.getItem('usuario')) || {};
  feedback.value.nombreUsuario = usuarioData?.username || 'Anónimo';
  feedback.value.rol = usuarioData?.rol || 'SIN_ROL';

  try {
    await enviarFeedback(feedback.value);
    mensaje.value = '✅ ¡Gracias por tu feedback!';
    feedbackEnviado.value = true;
  } catch (error) {
    console.error('Error:', error);
    mensaje.value = '❌ Error al enviar el feedback.';
  }
};

const setPuntuacion = (valor) => {
  feedback.value.puntaje = valor;
};

const cerrarFormulario = () => {
  feedbackEnviado.value = true;
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
