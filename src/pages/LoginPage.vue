<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-page flex flex-center">
        <q-card class="login-card shadow-10 q-pa-lg">
          <!-- Header / Branding con Logo Oficial XIS -->
          <div class="text-center q-mb-lg">
            <div class="login-logo-wrapper q-mb-sm shadow-3">
              <img src="@/assets/xis-logo.png" alt="XIS Logo" class="login-logo-img" />
            </div>
            <div class="text-h5 text-weight-bolder text-primary">
              ERP <span class="text-secondary">XIS</span>
            </div>
            <div class="text-caption text-grey-7">
              Gestión Integral de Taller y Servicios de Cómputo
            </div>
          </div>

          <!-- Alert for Errors -->
          <q-banner
            v-if="errorMessage"
            dense
            rounded
            class="bg-red-1 text-negative q-mb-md border-negative"
          >
            <template #avatar>
              <q-icon name="error_outline" color="negative" />
            </template>
            {{ errorMessage }}
          </q-banner>

          <!-- Login Form -->
          <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
            <!-- Email -->
            <q-input
              v-model="form.email"
              label="Correo Electrónico"
              outlined
              dense
              autocomplete="email"
              :rules="[
                (val) => !!val || 'El correo electrónico es requerido',
                (val) => /.+@.+\..+/.test(val) || 'Ingrese un correo electrónico válido',
              ]"
            >
              <template #prepend>
                <q-icon name="mail" color="primary" />
              </template>
            </q-input>

            <!-- Password -->
            <q-input
              v-model="form.password"
              :type="isPwdVisible ? 'text' : 'password'"
              label="Contraseña"
              outlined
              dense
              autocomplete="current-password"
              :rules="[
                (val) => !!val || 'La contraseña es requerida',
                (val) => val.length >= 6 || 'Debe tener al menos 6 caracteres',
              ]"
            >
              <template #prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template #append>
                <q-icon
                  :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdVisible = !isPwdVisible"
                />
              </template>
            </q-input>

            <!-- Submit Button -->
            <div class="q-pt-sm">
              <q-btn
                type="submit"
                color="primary"
                class="full-width text-weight-bold"
                size="md"
                label="Iniciar Sesión"
                icon-right="login"
                :loading="loading"
              >
                <template #loading>
                  <q-spinner-dots class="on-left" />
                  Verificando...
                </template>
              </q-btn>
            </div>
          </q-form>

          <div class="text-center text-caption text-grey-6 q-mt-lg">
            Sistema seguro con autenticación JWT &bull; XIS ERP &copy; {{ currentYear }}
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const currentYear = computed(() => new Date().getFullYear())

const form = reactive({
  email: '',
  password: '',
})

const isPwdVisible = ref(false)
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    })

    $q.notify({
      type: 'positive',
      message: `¡Bienvenido(a), ${authStore.userName || 'Usuario'}!`,
      caption: `Rol: ${authStore.userRole === 'admin' ? 'Administrador' : 'Técnico'}`,
      position: 'top-right',
      icon: 'check_circle',
      timeout: 3000,
    })

    // Redireccionar a la ruta deseada o al inicio
    const redirectUrl = route.query.redirect || '/'
    router.replace(redirectUrl)
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0]
      errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError
    } else {
      errorMessage.value =
        'No se pudo conectar con el servidor. Verifique que el servicio esté activo.'
    }

    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top-right',
      icon: 'error',
      timeout: 4000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #091c4d 0%, #1254e0 50%, #0f172a 100%);
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  background-color: #ffffff;
}

.login-logo-wrapper {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(92, 184, 17, 0.4);
}

.login-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.border-negative {
  border-left: 4px solid #c10015;
}
</style>
