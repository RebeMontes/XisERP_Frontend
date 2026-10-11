import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import { Notify } from 'quasar'
import routes from './routes.js'
import { useAuthStore } from '@/stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  })

  // Guard de navegación global para proteger rutas con JWT
  Router.beforeEach((to) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
    const guestOnly = to.matched.some((record) => record.meta.guestOnly)

    // Si la ruta requiere sesión y no hay token, redirigir al login guardando la ruta previa
    if (requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Si la ruta requiere rol de administrador y el usuario no lo tiene
    if (requiresAdmin && !authStore.isAdmin) {
      Notify.create({
        type: 'negative',
        message: 'Acceso restringido: este módulo es exclusivo para administradores.',
        position: 'top-right',
        icon: 'gpp_bad',
        timeout: 3500,
      })
      return '/'
    }

    // Si la ruta es exclusiva para invitados (ej. login) y ya está autenticado, mandar al inicio
    if (guestOnly && authStore.isAuthenticated) {
      return '/'
    }
  })

  return Router
})
