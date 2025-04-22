import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginRequest } from '@/services/LoginService.js';
import { isLoggedIn } from '@/stores/sessionStore'; // Importamos el estado

export default function useLogin() {
  const router = useRouter();
  const usuario = ref('');
  const password = ref('');
  const usuarioVacio = ref(false);
  const passwordVacio = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  const limpiarMensajes = () => {
    errorMessage.value = '';
    successMessage.value = '';
  };

  const login = async () => {
    limpiarMensajes();

    usuarioVacio.value = !usuario.value.trim();
    passwordVacio.value = !password.value.trim();

    if (usuarioVacio.value || passwordVacio.value) {
      errorMessage.value = 'Por favor, ingrese usuario y contraseña.';
      return;
    }

    try {
      const data = await loginRequest(usuario.value, password.value);

      // ⚠️ CORREGIDO: usar 'status' en lugar de 'statusCode'
      if (data.status === 200) {
        successMessage.value = 'Inicio de sesión correcto. Redirigiendo...';

        // Guardar datos en sessionStorage
        sessionStorage.setItem('usuario', JSON.stringify({
          username: usuario.value,
          rol: data.rol,
          activo: data.activo
        }));

        isLoggedIn.value = true;

        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        errorMessage.value = data.message || 'Usuario o contraseña incorrectos.';
      }
    } catch (error) {
      console.error("Error en login:", error);
      errorMessage.value = 'Error al conectar con el servidor.';
    }
  };

  return { 
    usuario, 
    password, 
    usuarioVacio, 
    passwordVacio, 
    errorMessage, 
    successMessage, 
    login 
  };
}
