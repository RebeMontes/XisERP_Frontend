<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Topbar Premium y Estándar Empresarial -->
    <q-header elevated class="bg-white text-dark topbar-header">
      <q-toolbar class="q-px-md">
        <!-- Botón para alternar menú lateral -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Alternar menú"
          color="primary"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <!-- Título / Contexto del ERP -->
        <q-toolbar-title class="row items-center no-wrap text-subtitle1">
          <span class="text-weight-bold text-primary">ERP XIS</span>
          <q-separator vertical inset class="q-mx-sm gt-xs" />
          <span class="text-caption text-grey-7 gt-xs">Control de Reparaciones y Soporte</span>
        </q-toolbar-title>

        <q-space />

        <!-- Badge de Taller / Empresa Activa -->
        <div class="gt-sm q-mr-md">
          <q-badge
            color="green-1"
            text-color="secondary"
            class="q-py-xs q-px-sm border-secondary text-weight-medium"
          >
            <q-icon name="storefront" size="14px" class="q-mr-xs" />
            Taller Principal
          </q-badge>
        </div>

        <!-- Perfil del Usuario y Acciones -->
        <div class="row items-center q-gutter-x-sm">
          <q-btn flat no-caps class="user-menu-btn q-px-sm border-radius-8">
            <div class="row items-center no-wrap">
              <div class="relative-position q-mr-sm">
                <q-avatar size="34px" color="primary" text-color="white" class="text-weight-bold">
                  {{ userInitials }}
                </q-avatar>
                <span class="avatar-status-badge"></span>
              </div>

              <div class="column text-left gt-xs q-mr-xs">
                <span class="text-weight-bold text-caption text-dark line-height-tight">
                  {{ authStore.userName }}
                </span>
                <span
                  class="text-caption text-secondary text-weight-medium"
                  style="font-size: 11px"
                >
                  {{ authStore.userRole === 'admin' ? 'Administrador' : 'Técnico' }}
                </span>
              </div>
              <q-icon name="keyboard_arrow_down" size="18px" color="grey-7" />
            </div>

            <!-- Menú desplegable del usuario -->
            <q-menu auto-close anchor="bottom end" self="top end" class="shadow-4 border-radius-8">
              <q-list style="min-width: 220px" class="q-py-xs">
                <q-item class="bg-grey-1">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="badge" size="36px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark">{{
                      authStore.userName
                    }}</q-item-label>
                    <q-item-label caption class="text-grey-6">{{
                      authStore.userEmail
                    }}</q-item-label>
                    <div class="q-mt-xs">
                      <q-badge
                        :color="authStore.userRole === 'admin' ? 'primary' : 'secondary'"
                        class="text-weight-medium"
                      >
                        {{ authStore.userRole === 'admin' ? 'Rol Administrador' : 'Rol Técnico' }}
                      </q-badge>
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator class="q-my-xs" />

                <q-item clickable v-ripple @click="confirmLogout" class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section class="text-weight-medium">Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer Lateral con MenuPrincipal -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :breakpoint="800"
      class="drawer-sidebar"
    >
      <MenuPrincipal />
    </q-drawer>

    <!-- Contenedor Principal de Páginas -->
    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import MenuPrincipal from '@/components/MenuPrincipal.vue'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const userInitials = computed(() => {
  const name = authStore.userName || 'Usuario'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
})

function confirmLogout() {
  $q.dialog({
    title: 'Cerrar Sesión',
    message: '¿Está seguro de que desea salir del sistema ERP XIS?',
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-7',
    },
    ok: {
      label: 'Cerrar Sesión',
      color: 'negative',
      flat: false,
    },
    persistent: true,
  }).onOk(async () => {
    await authStore.logout()
    $q.notify({
      type: 'info',
      message: 'Sesión cerrada correctamente.',
      position: 'top-right',
      icon: 'logout',
      timeout: 2500,
    })
    router.replace('/login')
  })
}
</script>

<style scoped lang="scss">
.topbar-header {
  background-color: #ffffff;
  border-bottom: 1px solid #cbd5e1;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05) !important;
}

.drawer-sidebar {
  border-right: 1px solid #1e293b;
  background-color: #0d172a;
}

.main-page-container {
  background-color: #eaedf2; // Contraste equilibrado sin llegar al modo oscuro
  min-height: calc(100vh - 50px);
}

.border-radius-8 {
  border-radius: 8px;
}

.border-secondary {
  border: 1px solid rgba(92, 184, 17, 0.4);
}

.user-menu-btn {
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f1f5f9;
  }
}

.avatar-status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  background-color: #5cb811;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.line-height-tight {
  line-height: 1.2;
}
</style>
