<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Sincronizar datos y rol del usuario con el backend al iniciar la aplicación
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
    } catch {
      // Si el token no es válido o expiró, fetchUser limpia la sesión automáticamente
    }
  }
})
</script>
