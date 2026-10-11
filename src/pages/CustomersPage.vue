<template>
  <q-page class="q-pa-lg">
    <!-- Header del Módulo -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-dark row items-center">
          <q-icon name="people" color="primary" class="q-mr-sm" size="32px" />
          Clientes
        </div>
        <div class="text-caption text-grey-8">
          Gestión del padrón de clientes, empresas y contactos
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          color="primary"
          icon="add"
          label="Nuevo Cliente"
          no-caps
          unelevated
          class="border-radius-8"
        />
      </div>
    </div>

    <!-- Contenedor / Estado Vacío Inicial -->
    <q-card flat class="q-pa-xl text-center border-radius-12 bg-white card-border shadow-1">
      <div class="column items-center q-gutter-md">
        <q-avatar size="80px" color="blue-1" text-color="primary">
          <q-icon name="group_add" size="44px" />
        </q-avatar>
        <div class="text-h6 text-weight-medium text-dark">Módulo de Clientes</div>
        <div class="text-body2 text-grey-6" style="max-width: 500px">
          Aquí se administrarán los clientes particulares y corporativos, su historial de equipos en
          reparación y órdenes de servicio.
        </div>
        <q-btn outline color="primary" icon="refresh" label="Actualizar vista" no-caps />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
// Módulo de clientes - inicializado vacío
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}
.border-radius-12 {
  border-radius: 12px;
}
.card-border {
  border: 1px solid #cbd5e1;
}
</style>
