<template>
  <q-page class="q-pa-lg">
    <!-- Header de Bienvenida -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-dark">
          Bienvenido(a), {{ authStore.userName || 'Usuario' }}
        </div>
        <div class="text-caption text-grey-7">
          Panel de Control &bull; ERP XIS Sistema de Reparación y Soporte
        </div>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-btn
          color="primary"
          icon="people"
          label="Ir a Clientes"
          to="/clientes"
          no-caps
          unelevated
          class="border-radius-8"
        />
        <q-btn
          color="secondary"
          icon="manage_accounts"
          label="Ir a Usuarios"
          to="/usuarios"
          no-caps
          unelevated
          class="border-radius-8"
        />
      </div>
    </div>

    <!-- Tarjetas de Métricas Rápidas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="q-pa-md border-radius-12 bg-white card-metric">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">Órdenes en Taller</div>
              <div class="text-h5 text-weight-bolder text-primary q-mt-xs">0</div>
            </div>
            <q-avatar color="blue-1" text-color="primary" icon="build" size="48px" />
          </div>
          <div class="text-caption text-grey-6 q-mt-sm">Equipos en revisión y diagnóstico</div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="q-pa-md border-radius-12 bg-white card-metric">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">Clientes Registrados</div>
              <div class="text-h5 text-weight-bolder text-secondary q-mt-xs">0</div>
            </div>
            <q-avatar color="green-1" text-color="secondary" icon="people" size="48px" />
          </div>
          <div class="text-caption text-grey-6 q-mt-sm">
            Padrón de clientes particulares y empresas
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="q-pa-md border-radius-12 bg-white card-metric">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">Reparaciones Listas</div>
              <div class="text-h5 text-weight-bolder text-dark q-mt-xs">0</div>
            </div>
            <q-avatar color="indigo-1" text-color="indigo" icon="check_circle" size="48px" />
          </div>
          <div class="text-caption text-grey-6 q-mt-sm">Pendientes de entrega al cliente</div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="q-pa-md border-radius-12 bg-white card-metric">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">Personal Activo</div>
              <div class="text-h5 text-weight-bolder text-positive q-mt-xs">1</div>
            </div>
            <q-avatar color="teal-1" text-color="teal" icon="engineering" size="48px" />
          </div>
          <div class="text-caption text-grey-6 q-mt-sm">Técnicos y operadores en turno</div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}
.border-radius-12 {
  border-radius: 12px;
}
.card-metric {
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.card-metric:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(18, 84, 224, 0.12);
  border-color: #93c5fd;
}
</style>
