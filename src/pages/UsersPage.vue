<template>
  <q-page class="q-pa-lg">
    <!-- Header del Módulo -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bolder text-dark row items-center">
          <q-avatar size="38px" color="primary" text-color="white" class="q-mr-sm shadow-2">
            <q-icon name="manage_accounts" size="24px" />
          </q-avatar>
          Gestión de Usuarios
          <q-badge
            color="blue-1"
            text-color="primary"
            class="q-ml-sm text-weight-bold q-px-sm q-py-xs border-primary"
          >
            {{ totalUsers }} {{ totalUsers === 1 ? 'usuario' : 'usuarios' }}
          </q-badge>
        </div>
        <div class="text-caption text-grey-8 q-mt-xs">
          Administración de cuentas, credenciales, técnicos y niveles de acceso al ERP XIS
        </div>
      </div>

      <div>
        <q-btn
          color="secondary"
          icon="person_add"
          label="Nuevo Usuario"
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
        <div class="col-12 col-md-5">
          <q-input
            v-model="filters.search"
            placeholder="Buscar por nombre o correo electrónico..."
            outlined
            dense
            clearable
            debounce="350"
            @update:model-value="loadUsers"
          >
            <template #prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
        </div>

        <!-- Filtro por Rol -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filters.role"
            :options="roleFilterOptions"
            emit-value
            map-options
            outlined
            dense
            label="Filtrar por Rol"
            @update:model-value="loadUsers"
          >
            <template #prepend>
              <q-icon name="filter_alt" color="grey-7" size="18px" />
            </template>
          </q-select>
        </div>

        <!-- Filtro por Estado -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filters.status"
            :options="statusFilterOptions"
            emit-value
            map-options
            outlined
            dense
            label="Filtrar por Estado"
            @update:model-value="loadUsers"
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
            @click="loadUsers"
          >
            <q-tooltip>Actualizar listado</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card>

    <!-- Tabla Principal de Usuarios -->
    <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
        binary-state-sort
        no-data-label="No se encontraron usuarios registrados"
        class="users-table"
      >
        <!-- Columna de Usuario (Avatar + Nombre + Email) -->
        <template #body-cell-user="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar
                size="40px"
                :color="props.row.role === 'admin' ? 'blue-1' : 'green-1'"
                :text-color="props.row.role === 'admin' ? 'primary' : 'secondary'"
                class="q-mr-md text-weight-bolder avatar-border"
              >
                {{ getInitials(props.row.name) }}
              </q-avatar>
              <div class="column">
                <div class="row items-center no-wrap">
                  <span class="text-weight-bold text-dark text-body2 user-name">
                    {{ props.row.name }}
                  </span>
                  <q-badge
                    v-if="isCurrentUser(props.row.id)"
                    color="primary"
                    class="q-ml-xs text-weight-medium"
                    style="font-size: 10px"
                  >
                    Tú
                  </q-badge>
                </div>
                <div class="text-caption text-grey-7 row items-center q-mt-xs">
                  <q-icon name="email" size="13px" class="q-mr-xs text-grey-5" />
                  {{ props.row.email }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Columna de Rol (Chip Visual) -->
        <template #body-cell-role="props">
          <q-td :props="props">
            <q-chip
              v-if="props.row.role === 'admin'"
              dense
              class="q-px-sm role-chip-admin text-weight-bold"
            >
              <q-icon name="admin_panel_settings" size="16px" class="q-mr-xs text-primary" />
              Administrador
            </q-chip>
            <q-chip v-else dense class="q-px-sm role-chip-technician text-weight-bold">
              <q-icon name="engineering" size="16px" class="q-mr-xs text-secondary" />
              Técnico
            </q-chip>
          </q-td>
        </template>

        <!-- Columna de Estado (Activo / Inactivo) -->
        <template #body-cell-status="props">
          <q-td :props="props">
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
        </template>

        <!-- Columna de Fecha de Creación -->
        <template #body-cell-created_at="props">
          <q-td :props="props" class="text-grey-8">
            <div class="row items-center no-wrap">
              <q-icon name="calendar_today" size="14px" class="q-mr-xs text-grey-6" />
              <span>{{ formatDate(props.row.created_at) }}</span>
            </div>
          </q-td>
        </template>

        <!-- Columna de Acciones -->
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <div class="row items-center justify-end q-gutter-x-xs no-wrap">
              <!-- Editar Usuario -->
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                class="action-btn"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip>Editar información de usuario</q-tooltip>
              </q-btn>

              <!-- Desactivar / Activar Usuario -->
              <q-btn
                v-if="props.row.is_active"
                flat
                round
                dense
                color="negative"
                icon="person_off"
                class="action-btn"
                :disable="isCurrentUser(props.row.id)"
                @click="confirmToggleStatus(props.row)"
              >
                <q-tooltip>
                  {{
                    isCurrentUser(props.row.id)
                      ? 'No puede desactivar su propia cuenta'
                      : 'Desactivar acceso al usuario'
                  }}
                </q-tooltip>
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
                <q-tooltip>Habilitar / Activar cuenta de usuario</q-tooltip>
              </q-btn>
            </div>
          </q-td>
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

    <!-- Componente Independiente de Formulario Nuevo / Editar -->
    <UserFormDialog v-model="dialogVisible" :user="selectedUser" @saved="onUserSaved" />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'
import UserFormDialog from '@/components/users/UserFormDialog.vue'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)
const users = ref([])
const totalUsers = ref(0)

const dialogVisible = ref(false)
const selectedUser = ref(null)

const filters = reactive({
  search: '',
  role: '',
  status: '',
})

const roleFilterOptions = [
  { label: 'Todos los roles', value: '' },
  { label: 'Administradores', value: 'admin' },
  { label: 'Técnicos', value: 'technician' },
]

const statusFilterOptions = [
  { label: 'Todos los estados', value: '' },
  { label: 'Solo Activos', value: 'active' },
  { label: 'Solo Inactivos', value: 'inactive' },
]

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'user',
    label: 'Usuario',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Rol en ERP',
    align: 'left',
    field: 'role',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    align: 'left',
    field: 'is_active',
    sortable: true,
  },
  {
    name: 'created_at',
    label: 'Fecha de Registro',
    align: 'left',
    field: 'created_at',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
]

function isCurrentUser(userId) {
  return authStore.user?.id === userId
}

function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

async function loadUsers() {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      perPage: pagination.value.rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
    }

    if (filters.search) params.search = filters.search
    if (filters.role) params.role = filters.role
    if (filters.status) params.status = filters.status

    const response = await api.get('/users', { params })

    if (response.data?.success) {
      users.value = response.data.data
      const meta = response.data.meta
      pagination.value.rowsNumber = meta.total
      totalUsers.value = meta.total
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al cargar el listado de usuarios.',
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
  loadUsers()
}

function openCreateDialog() {
  selectedUser.value = null
  dialogVisible.value = true
}

function openEditDialog(user) {
  selectedUser.value = { ...user }
  dialogVisible.value = true
}

function onUserSaved() {
  loadUsers()
}

function confirmToggleStatus(user) {
  const willDeactivate = Boolean(user.is_active)
  const actionText = willDeactivate ? 'desactivar' : 'activar'
  const actionColor = willDeactivate ? 'negative' : 'positive'

  $q.dialog({
    title: willDeactivate ? 'Desactivar Usuario' : 'Activar Usuario',
    message: willDeactivate
      ? `¿Está seguro de que desea desactivar a "${user.name}"? El usuario no podrá acceder al sistema ERP XIS hasta ser reactivado.`
      : `¿Desea reactivar el acceso para "${user.name}"? Podrá volver a iniciar sesión con sus credenciales habituales.`,
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-7',
    },
    ok: {
      label: willDeactivate ? 'Sí, Desactivar' : 'Sí, Activar',
      color: actionColor,
      flat: false,
    },
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await api.patch(`/users/${user.id}/toggle-status`)
      $q.notify({
        type: 'positive',
        message: response.data.message || `Usuario ${actionText}do correctamente.`,
        position: 'top-right',
        icon: 'check_circle',
        timeout: 3000,
      })
      loadUsers()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo cambiar el estado del usuario.',
        position: 'top-right',
        icon: 'error',
        timeout: 4000,
      })
    }
  })
}

onMounted(() => {
  loadUsers()
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

.avatar-border {
  border: 1.5px solid rgba(18, 84, 224, 0.2);
}

.user-name {
  color: #0f172a;
}

// Chips de Roles con Colores XIS
.role-chip-admin {
  background: #eff6ff !important;
  color: #1254e0 !important;
  border: 1px solid rgba(18, 84, 224, 0.3);
}

.role-chip-technician {
  background: #f0fdf4 !important;
  color: #166534 !important;
  border: 1px solid rgba(92, 184, 17, 0.4);
}

// Chips de Estado
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

.users-table {
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
