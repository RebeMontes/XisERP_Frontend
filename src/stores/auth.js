import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    expiresIn: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userRole: (state) => state.user?.role || '',
    isAdmin: (state) => state.user?.role === 'admin',
    isTechnician: (state) => state.user?.role === 'technician',
  },

  actions: {
    setAuth(payload) {
      this.token = payload.access_token || payload.token
      this.user = payload.user || null
      this.expiresIn = payload.expires_in || null
    },

    clearAuth() {
      this.token = null
      this.user = null
      this.expiresIn = null
    },

    async login(credentials) {
      const response = await api.post('/auth/login', credentials)
      if (response.data?.success && response.data?.data) {
        this.setAuth(response.data.data)
      }
      return response.data
    },

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

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch {
        // Silently catch network or expired token errors on logout
      } finally {
        this.clearAuth()
      }
    },
  },

  persist: {
    key: 'erp_xis_auth',
    storage: localStorage,
    paths: ['token', 'user'],
  },
})
