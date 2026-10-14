import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    expiresIn: null,
  }),

  getters: {
    // Helpers para verificar autenticación y rol del usuario en vistas y menú
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userRole: (state) => state.user?.role || '',
    isAdmin: (state) => state.user?.role === 'admin',
    isTechnician: (state) => state.user?.role === 'technician',
  },

  actions: {
    // Guarda el token y el usuario en el estado
    setAuth(payload) {
      this.token = payload.access_token || payload.token
      this.user = payload.user || null
      this.expiresIn = payload.expires_in || null
    },

    // Limpia el estado de autenticación (reseteo a null)
    clearAuth() {
      this.token = null
      this.user = null
      this.expiresIn = null
    },

    // Iniciar sesión y guardar sesión si es exitoso
    async login(credentials) {
      const response = await api.post('/auth/login', credentials)
      if (response.data?.success && response.data?.data) {
        this.setAuth(response.data.data)
      }
      return response.data
    },

    // Obtener los datos frescos del usuario autenticado (/auth/me)
    async fetchUser() {
      if (!this.token) return null
      try {
        const response = await api.get('/auth/me')
        if (response.data?.success && response.data?.data?.user) {
          this.user = response.data.data.user
        }
        return this.user
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    // Renovar el token JWT
    async refreshToken() {
      try {
        const response = await api.post('/auth/refresh')
        if (response.data?.success && response.data?.data) {
          this.setAuth(response.data.data)
        }
        return response.data
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    // Cerrar sesión en el backend e invalidar el estado local
    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch {
        // Ignorar errores de red si el token ya venció en el backend
      } finally {
        this.clearAuth()
      }
    },
  },

  // Persistir token y usuario en localStorage para mantener sesión al recargar la página
  persist: {
    key: 'erp_xis_auth',
    storage: localStorage,
    paths: ['token', 'user'],
  },
})
