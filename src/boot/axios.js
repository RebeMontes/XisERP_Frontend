import { defineBoot } from '#q-app'
import axios from 'axios'
import { Notify } from 'quasar'
import { useAuthStore } from '@/stores/auth'

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default defineBoot(({ app, router }) => {
  // Request Interceptor: Attach JWT Bearer Token if available
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

  // Response Interceptor: Global 401 Unauthorized handling & errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const authStore = useAuthStore()

      if (error.response) {
        const { status, config } = error.response
        const isLoginRequest = config.url && config.url.includes('/auth/login')

        if (status === 401 && !isLoginRequest) {
          // Token expired or invalid
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
        // Network or connection error
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

  // Provide $axios and $api globally in Vue components (this.$axios, this.$api)
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
