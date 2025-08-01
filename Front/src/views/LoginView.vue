<template>
  <div class="login-container">
    <div class="login-card animate-fade-in">
      <img src="@/assets/images/LogoTatis.png" alt="Logo" class="login-logo animate-pop-in">
      <h2 class="login-title">Cremería Tatis</h2>
      <p class="login-subtitle">Bienvenido, por favor inicia sesión.</p>
      
      <label for="usuario" class="sr-only">Usuario</label>
      <input id="usuario" type="text" v-model="usuario" placeholder="Nombre de usuario" class="login-input animate-slide-in" autofocus @keyup.enter="login">

      <label for="password" class="sr-only">Contraseña</label>
      <input id="password" type="password" v-model="password" placeholder="Contraseña" class="login-input animate-slide-in" @keyup.enter="login">
      
      <p v-if="errorMessage" class="error-message animate-fade-in">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message animate-fade-in">{{ successMessage }}</p>
      
      <div class="remember-me">
        <input type="checkbox" id="remember" v-model="remember" class="remember-checkbox">
        <label for="remember" class="remember-label">Recordarme</label>
      </div>
      
      <button class="btn btn-login animate-bounce" @click="login">Iniciar Sesión</button>
      <button class="btn btn-reset animate-bounce" @click="limpiar">Limpiar</button>
    </div>
  </div>
</template>

<script>
import useLogin from '@/js/login.js';

export default {
  setup() {
    return useLogin();
  }
};
</script>

<style scoped>
/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
.animate-slide-in { animation: slideIn 0.5s ease-in-out; }
.animate-pop-in { animation: popIn 0.5s ease-in-out; }
.animate-bounce:hover { animation: bounce 0.4s ease-in-out; }

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #F5F5DC;
  overflow: hidden;
}

.login-card {
  background: #2C3E50;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
  color: white;
}

.login-logo {
  width: 100px;
  height: auto;
  margin-bottom: 15px;
}

.login-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 1rem;
  margin-bottom: 20px;
}

.login-input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.login-input:focus {
  outline: none;
  border-color: #FFB400;
  box-shadow: 0 0 8px rgba(255, 180, 0, 0.5);
}

.remember-me {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 15px;
}

.remember-checkbox {
  cursor: pointer;
}

.remember-label {
  font-size: 1rem;
  cursor: pointer;
}

.btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

.btn-login {
  background: #FFB400;
  color: white;
  border: none;
}

.btn-login:hover {
  background: #E0A000;
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.3);
}

.btn-reset {
  background: #FF6B6B;
  color: white;
  border: none;
}

.btn-reset:hover {
  background: #D94A4A;
  box-shadow: 0px 7px 15px rgba(0, 0, 0, 0.3);
}

.error-message {
  color: #FF4C4C;
  font-size: 0.9rem;
  margin-top: 5px;
}

.success-message {
  color: #4CAF50;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 1.5rem;
  }
}

/* Hidden labels (accessibility improvement) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
