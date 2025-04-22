import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default function useHome() {
  const router = useRouter();
  const loading = ref(false);
  const contenido = ref('');

  const verEstadisticas = () => {
    router.push('/estadisticas');
  };

  const irAVentas = () => {
    router.push('/ventas');
  };

  const cargarContenido = async (url) => {
    loading.value = true;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      contenido.value = await response.text();
    } catch (error) {
      console.error("Error al cargar el contenido:", error);
      contenido.value = `<div class="alert alert-danger text-center mt-4">
                           <strong>Error:</strong> No se pudo cargar el contenido.
                         </div>`;
    } finally {
      loading.value = false;
    }
  };

  return { loading, contenido, verEstadisticas, irAVentas, cargarContenido };
}
