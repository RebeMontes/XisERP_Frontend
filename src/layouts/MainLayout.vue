<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="laptop_chromebook" size="28px" class="q-mr-sm" />
          <span class="text-weight-bold">ERP XIS</span>
          <span class="text-caption q-ml-sm text-blue-2 gt-xs">Control de Reparaciones</span>
        </q-toolbar-title>

        <!-- User profile & Logout menu -->
        <div class="row items-center q-gutter-sm">
          <q-btn flat no-caps class="q-px-sm">
            <div class="row items-center no-wrap">
              <q-avatar size="32px" color="blue-9" text-color="white" class="q-mr-xs">
                {{ userInitials }}
              </q-avatar>
              <div class="column text-left gt-xs">
                <span class="text-weight-bold text-caption">{{ authStore.userName }}</span>
                <span class="text-caption text-blue-2" style="font-size: 10px">
                  {{ authStore.userRole === 'admin' ? 'Administrador' : 'Técnico' }}
                </span>
              </div>
              <q-icon name="arrow_drop_down" size="18px" />
            </div>

            <q-menu auto-close>
              <q-list style="min-width: 200px">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ authStore.userName }}</q-item-label>
                    <q-item-label caption>{{ authStore.userEmail }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="confirmLogout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section class="text-negative text-weight-medium"
                    >Cerrar Sesión</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.label" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import EssentialLink from '@/components/EssentialLink.vue'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

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
    message: '¿Está seguro de que desea salir del sistema ERP?',
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
    })
    router.replace('/login')
  })
}

const linksList = [
  {
    label: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    label: 'GitHub',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    label: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    label: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    label: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    label: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    label: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
