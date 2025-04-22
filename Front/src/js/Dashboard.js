import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default function useDashboard() {
  const router = useRouter();
  const username = ref('');

  onMounted(() => {
    const userData = JSON.parse(sessionStorage.getItem('usuario'));

    if (!userData || !userData.username) {
      router.push('/login'); // Redirigir al login si no hay sesión activa
    } else {
      username.value = userData.username; // Obtener el nombre del usuario
    }
  });

  return {
    username
  };
}
