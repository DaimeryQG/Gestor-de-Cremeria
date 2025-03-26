import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import UsersView from '../views/UsersView.vue';
import VentasView from '../views/VentasView.vue';
import ProductosView from '../views/ProductosView.vue';
import ProveedorView from '../views/ProveedorView.vue';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/usuarios', component: UsersView, meta: { requiresAuth: true } },
  { path: '/ventas', component: VentasView, meta: { requiresAuth: true } },
  { path: '/productos', component: ProductosView, meta: { requiresAuth: true } },
  { path: '/proveedores', component: ProveedorView, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Redirigir al login si el usuario no está autenticado
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('usuario'); // Convertir en booleano

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirigir al login si no hay sesión
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard'); // 🔥 Si ya está autenticado, enviarlo al Dashboard
  } else {
    next();
  }
});

export default router;
