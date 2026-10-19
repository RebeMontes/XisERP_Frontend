<template>
  <q-page class="q-pa-lg">
    <!-- Header del Módulo -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bolder text-dark row items-center">
          <q-avatar size="38px" color="primary" text-color="white" class="q-mr-sm shadow-2">
            <q-icon name="people" size="24px" />
          </q-avatar>
          Clientes
          <q-badge
            color="blue-1"
            text-color="primary"
            class="q-ml-sm text-weight-bold q-px-sm q-py-xs border-primary"
          >
            {{ totalClients }} {{ totalClients === 1 ? 'cliente' : 'clientes' }}
          </q-badge>
        </div>
        <div class="text-caption text-grey-8 q-mt-xs">
          Gestión del padrón de clientes, empresas, datos fiscales y contactos
        </div>
      </div>

      <div>
        <q-btn
          color="secondary"
          icon="person_add"
          label="Nuevo Cliente"
          no-caps
          unelevated
          class="border-radius-8 text-weight-bold shadow-2 q-px-md"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <q-card flat class="q-pa-md q-mb-md border-radius-12 bg-white card-border shadow-1">
      <div class="row q-col-gutter-md items-center">
        <!-- Búsqueda en Tiempo Real -->
        <div class="col-12 col-md-6">
          <q-input
            v-model="filters.search"
            placeholder="Buscar por número de cliente, razón social, nombre comercial o RFC..."
            outlined
            dense
            clearable
            debounce="350"
            @update:model-value="loadClients"
          >
            <template #prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
        </div>

        <!-- Filtro por Estado -->
        <div class="col-12 col-sm-6 col-md-5">
          <q-select
            v-model="filters.status"
            :options="statusFilterOptions"
            emit-value
            map-options
            outlined
            dense
            label="Filtrar por Estado"
            @update:model-value="loadClients"
          >
            <template #prepend>
              <q-icon name="toggle_on" color="grey-7" size="18px" />
            </template>
          </q-select>
        </div>

        <!-- Botón Recargar -->
        <div class="col-12 col-md-1 row justify-end">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="refresh"
            :loading="loading"
            @click="loadClients"
          >
            <q-tooltip>Actualizar listado</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card>

   <!-- Tabla Principal de Clientes -->
    <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
      <q-table
        :rows="customers"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
        binary-state-sort
        rows-per-page-label="Registros por página:"
        no-data-label="No se encontraron clientes registrados"
        class="clients-table"
      >
        <!-- Slot personalizado para manejar la fila principal y la sección desplegable -->
        <template #body="props">
          <q-tr :props="props">
            <!-- Botón para expandir secciones -->
            <q-td auto-width>
              <q-btn
                flat
                dense
                round
                :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                color="primary"
                @click="props.expand = !props.expand"
              >
                <q-tooltip>Ver toda la información por secciones</q-tooltip>
              </q-btn>
            </q-td>
            
            <!-- Columna de Cliente (Razón Social / Nombre Comercial) -->
            <q-td key="legal_name" :props="props">
              <div class="column">
                <span class="text-weight-bold text-dark text-body2">
                  {{ props.row.legal_name }}
                </span>
                <span class="text-caption text-grey-7" v-if="props.row.trade_name">
                  Comercial: {{ props.row.trade_name }}
                </span>
                <span class="text-caption text-primary text-weight-medium" v-if="props.row.customer_number">
                  N° Cliente: {{ props.row.customer_number }}
                </span>
              </div>
            </q-td>

            <!-- Columna Datos Fiscales (RFC / Régimen) -->
            <q-td key="tax_info" :props="props">
              <div class="column">
                <span class="text-weight-bold text-dark">{{ props.row.taxid || 'N/D' }}</span>
                <span class="text-caption text-grey-7">Régimen: {{ props.row.tax_regime || 'N/D' }}</span>
              </div>
            </q-td>

            <!-- Columna Contacto (Teléfono / Email) -->
            <q-td key="contact" :props="props">
              <div class="column">
                <span class="text-grey-8" v-if="props.row.phone">
                  <q-icon name="phone" size="13px" class="q-mr-xs text-grey-6" />
                  {{ props.row.phone }}
                </span>
                <span class="text-caption text-grey-7" v-if="props.row.email">
                  <q-icon name="email" size="13px" class="q-mr-xs text-grey-6" />
                  {{ props.row.email }}
                </span>
                <span class="text-caption text-grey-6" v-if="props.row.contact_name">
                  Contacto: {{ props.row.contact_name }}
                </span>
              </div>
            </q-td>

            <!-- Columna Estado (Activo / Inactivo) -->
            <q-td key="status" :props="props">
              <q-chip
                v-if="props.row.is_active"
                dense
                class="q-px-sm status-chip-active text-weight-bold"
              >
                <span class="status-dot dot-active q-mr-xs"></span>
                Activo
              </q-chip>
              <q-chip v-else dense class="q-px-sm status-chip-inactive text-weight-bold">
                <span class="status-dot dot-inactive q-mr-xs"></span>
                Inactivo
              </q-chip>
            </q-td>

            <!-- Columna de Acciones -->
            <q-td key="actions" :props="props" class="text-right">
              <div class="row items-center justify-end q-gutter-x-xs no-wrap">
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  icon="edit"
                  class="action-btn"
                  @click="openEditDialog(props.row)"
                >
                  <q-tooltip>Editar información de cliente</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.is_active"
                  flat
                  round
                  dense
                  color="negative"
                  icon="person_off"
                  class="action-btn"
                  @click="confirmToggleStatus(props.row)"
                >
                  <q-tooltip>Desactivar cliente</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  flat
                  round
                  dense
                  color="positive"
                  icon="check_circle"
                  class="action-btn"
                  @click="confirmToggleStatus(props.row)"
                >
                  <q-tooltip>Activar cliente</q-tooltip>
                </q-btn>

                <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                class="action-btn"
                @click="confirmDeleteCustomer(props.row)"
              >
                <q-tooltip>Eliminar definitivamente</q-tooltip>
              </q-btn>
              </div>
            </q-td>
          </q-tr>

          <!-- FILA EXPANDIBLE: TODA LA INFORMACIÓN SEPARADA POR SECCIONES -->
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" class="bg-grey-1 q-pa-md">
              <div class="row q-col-gutter-md">
                <!-- Seccion 1: Datos Fiscales -->
                <div class="col-12 col-md-4">
                  <q-card flat class="q-pa-sm border-radius-8 bg-white card-border h-100">
                    <div class="text-weight-bold text-primary q-mb-xs row items-center">
                      <q-icon name="badge" size="18px" class="q-mr-xs" /> Datos Fiscales
                    </div>
                    <div class="text-caption text-grey-8"><b>Régimen:</b> {{ props.row.tax_regime || 'No especificado' }}</div>
                    <div class="text-caption text-grey-8"><b>Método de Pago:</b> {{ props.row.payment_method || 'No especificado' }}</div>
                    <div class="text-caption text-grey-8"><b>N° Cuenta:</b> {{ props.row.account_num || 'No especificado' }}</div>
                  </q-card>
                </div>

                <!-- Seccion 2: Domicilio -->
                <div class="col-12 col-md-4">
                  <q-card flat class="q-pa-sm border-radius-8 bg-white card-border h-100">
                    <div class="text-weight-bold text-primary q-mb-xs row items-center">
                      <q-icon name="place" size="18px" class="q-mr-xs" /> Domicilio
                    </div>
                    <div class="text-caption text-grey-8">
                      <b>Dirección:</b> {{ props.row.street || 'S/N' }} #{{ props.row.exterior_num || '' }} {{ props.row.interior_num ? 'Int. ' + props.row.interior_num : '' }}
                    </div>
                    <div class="text-caption text-grey-8"><b>Colonia:</b> {{ props.row.neighborhood || 'N/D' }}</div>
                    <div class="text-caption text-grey-8"><b>Ciudad / Municipio:</b> {{ props.row.city || 'N/D' }}, {{ props.row.municipality || 'N/D' }}</div>
                    <div class="text-caption text-grey-8"><b>Estado / C.P.:</b> {{ props.row.state || 'N/D' }} (C.P. {{ props.row.postal_code || 'N/D' }})</div>
                    <div class="text-caption text-grey-6 q-mt-xs" v-if="props.row.address_references"><i>Ref: {{ props.row.address_references }}</i></div>
                  </q-card>
                </div>

                <!-- Seccion 3: Contacto y Notas -->
                <div class="col-12 col-md-4">
                  <q-card flat class="q-pa-sm border-radius-8 bg-white card-border h-100">
                    <div class="text-weight-bold text-primary q-mb-xs row items-center">
                      <q-icon name="contacts" size="18px" class="q-mr-xs" /> Contacto y Notas
                    </div>
                    <div class="text-caption text-grey-8"><b>Contacto:</b> {{ props.row.contact_name || 'No especificado' }}</div>
                    <div class="text-caption text-grey-8"><b>WhatsApp:</b> {{ props.row.whatsapp || 'No especificado' }}</div>
                    <div class="text-caption text-grey-8"><b>Tipo Teléfono:</b> {{ props.row.phone_type || 'N/D' }}</div>
                    <div class="text-caption text-grey-7 q-mt-xs" v-if="props.row.notes"><b>Notas:</b> {{ props.row.notes }}</div>
                  </q-card>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- Slot de Carga Personalizado -->
        <template #loading>
          <q-inner-loading showing color="primary">
            <q-spinner-dots size="48px" />
          </q-inner-loading>
        </template>

        <!-- Slot Sin Datos -->
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-xl text-grey-6">
            <q-icon name="search_off" size="48px" class="q-mb-sm text-grey-5" />
            <div class="text-subtitle1 text-weight-medium">{{ message }}</div>
            <div class="text-caption">Pruebe ajustando los filtros de búsqueda</div>
          </div>
        </template>
      </q-table>
    </q-card>
    
    <!-- Componente Modal para Crear/Editar Cliente -->
    <CustomerFormDialog
      v-model="dialogVisible"
      :client="selectedClient"
      @saved="onClientSaved"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import CustomerFormDialog from '@/components/customers/CustomerFormDialog.vue'

const $q = useQuasar()

const loading = ref(false)
const customers = ref([])
const totalClients = ref(0)

const dialogVisible = ref(false)
const selectedClient = ref(null)

const filters = reactive({
  search: '',
  status: '',
})

const statusFilterOptions = [
  { label: 'Todos los estados', value: '' },
  { label: 'Solo Activos', value: 'active' },
  { label: 'Solo Inactivos', value: 'inactive' },
]

const pagination = ref({
  sortBy: 'legal_name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'expand',
    label: '',
    align: 'center',
    field: 'expand',
    sortable: false,
  },
  {

    name: 'legal_name',
    label: 'Cliente / Empresa',
    align: 'left',
    field: 'legal_name',
    sortable: true,
  },
  {
    name: 'tax_info',
    label: 'Datos Fiscales (RFC)',
    align: 'left',
    field: 'taxid',
    sortable: true,
  },
  {
    name: 'contact',
    label: 'Contacto',
    align: 'left',
    field: 'phone',
  },
  {
    name: 'status',
    label: 'Estado',
    align: 'left',
    field: 'is_active',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
]

// Cargar clientes con filtros y paginación desde el backend usando /customers
async function loadClients() {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      perPage: pagination.value.rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
    }

    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status

    const response = await api.get('/customers', { params })

    if (response.data?.success) {
      customers.value = response.data.data
      const meta = response.data.meta
      pagination.value.rowsNumber = meta.total
      totalClients.value = meta.total
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al cargar el listado de clientes.',
      position: 'top-right',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
  loadClients()
}

function openCreateDialog() {
  selectedClient.value = null
  dialogVisible.value = true
}

function openEditDialog(client) {
  selectedClient.value = { ...client }
  dialogVisible.value = true
}

function onClientSaved() {
  loadClients()
}

function confirmToggleStatus(client) {
  const willDeactivate = Boolean(client.is_active)
  const actionText = willDeactivate ? 'desactivar' : 'activar'
  const actionColor = willDeactivate ? 'negative' : 'positive'

  $q.dialog({
    title: willDeactivate ? 'Desactivar Cliente' : 'Activar Cliente',
    message: willDeactivate
      ? `¿Está seguro de que desea desactivar a "${client.legal_name}"?`
      : `¿Desea reactivar a "${client.legal_name}"?`,
    cancel: { flat: true, label: 'Cancelar', color: 'grey-7' },
    ok: { label: willDeactivate ? 'Sí, Desactivar' : 'Sí, Activar', color: actionColor },
    persistent: true,
  }).onOk(async () => {
    try {
      // CORREGIDO: Se usa client.id en lugar de customer.id
      const response = await api.patch(`/customers/${client.id}/toggle-status`)
      $q.notify({
        type: 'positive',
        message: response.data.message || `Cliente ${actionText}do correctamente.`,
        position: 'top-right',
        icon: 'check_circle',
      })
      loadClients()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo cambiar el estado del cliente.',
        position: 'top-right',
        icon: 'error',
      })
    }
  })
}
function confirmDeleteCustomer(client) {
  $q.dialog({
    title: 'Eliminar Cliente',
    message: `¿Estás completamente seguro de eliminar permanentemente a "${client.legal_name}"? Esta acción no se puede deshacer.`,
    cancel: { flat: true, label: 'Cancelar', color: 'grey-7' },
    ok: { label: 'Sí, Eliminar', color: 'negative' },
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await api.delete(`/customers/${client.id}`)
      $q.notify({
        type: 'positive',
        message: response.data.message || 'Cliente eliminado correctamente.',
        position: 'top-right',
        icon: 'check_circle',
      })
      loadClients() // Recarga el listado para reflejar los cambios
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo eliminar el cliente.',
        position: 'top-right',
        icon: 'error',
      })
    }
  })
}

onMounted(() => {
  loadClients()
})
</script>

<style scoped lang="scss">
.border-radius-8 {
  border-radius: 8px;
}
.border-radius-12 {
  border-radius: 12px;
}
.card-border {
  border: 1px solid #cbd5e1;
}
.border-primary {
  border: 1px solid rgba(18, 84, 224, 0.3);
}

.status-chip-active {
  background: #f0fdf4 !important;
  color: #15803d !important;
  border: 1px solid rgba(22, 163, 74, 0.3);
}

.status-chip-inactive {
  background: #fef2f2 !important;
  color: #b91c1c !important;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.dot-active {
  background-color: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.7);
}

.dot-inactive {
  background-color: #ef4444;
}

.action-btn {
  transition: transform 0.15s ease;
  &:hover {
    transform: scale(1.1);
  }
}

.clients-table {
  :deep(.q-table__top) {
    padding: 12px 16px;
  }
  :deep(thead tr th) {
    font-weight: 700;
    color: #475569;
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
    font-size: 12px;
    letter-spacing: 0.5px;
  }
  :deep(tbody tr:hover) {
    background-color: #f1f5f9;
  }
}
</style>