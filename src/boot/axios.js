import { defineBoot } from '#q-app'
import axios from 'axios'
import { Notify } from 'quasar'
import { useAuthStore } from '@/stores/auth'

// Instancia de Axios configurada con la URL base del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default defineBoot(({ app, router }) => {
  // Interceptor de peticiones: inyecta el token JWT Bearer si el usuario está autenticado
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Interceptor de respuestas: captura expiración de token (401) y fallos de red
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const authStore = useAuthStore()

      if (error.response) {
        const { status, config } = error.response
        const isLoginRequest = config.url && config.url.includes('/auth/login')

        // Si la sesión expiró y no es la pantalla de login, limpiar sesión y redirigir
        if (status === 401 && !isLoginRequest) {
          authStore.clearAuth()

          Notify.create({
            type: 'warning',
            message: 'Su sesión ha expirado. Por favor, ingrese de nuevo.',
            position: 'top-right',
            icon: 'lock_clock',
            timeout: 3500,
          })

          router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
        }
      } else if (error.request) {
        // Error de red o backend apagado
        Notify.create({
          type: 'negative',
          message: 'No se pudo conectar con el servidor backend. Verifique su conexión.',
          position: 'top-right',
          icon: 'wifi_off',
          timeout: 4000,
        })
      }

      return Promise.reject(error)
    },
  )

  // Hacer disponibles $axios y $api en la instancia global de Vue
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
