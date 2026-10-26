<template>
  <q-page class="q-pa-lg">
    <!-- Header del Módulo -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bolder text-dark row items-center">
          <q-avatar size="38px" color="primary" text-color="white" class="q-mr-sm shadow-2">
            <q-icon name="inventory_2" size="24px" />
          </q-avatar>
          Productos
          <q-badge
            color="blue-1"
            text-color="primary"
            class="q-ml-sm text-weight-bold q-px-sm q-py-xs border-primary"
          >
            {{ totalProducts }} {{ totalProducts === 1 ? 'producto' : 'productos' }}
          </q-badge>
        </div>
        <div class="text-caption text-grey-8 q-mt-xs">
          Gestión del catálogo de artículos, clasificaciones, precios y existencias en inventario
        </div>
      </div>

      <div>
        <q-btn
          color="secondary"
          icon="add_box"
          label="Nuevo Producto"
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
            placeholder="Buscar por código, nombre o descripción..."
            outlined
            dense
            clearable
            debounce="350"
            @update:model-value="loadProducts"
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
            @update:model-value="loadProducts"
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
            @click="loadProducts"
          >
            <q-tooltip>Actualizar listado</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card>

    <!-- Tabla Principal de Productos -->
    <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
      <q-table
        :rows="products"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
        binary-state-sort
        rows-per-page-label="Registros por página:"
        no-data-label="No se encontraron productos registrados"
        class="products-table"
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
                <q-tooltip>Ver toda la información del producto</q-tooltip>
              </q-btn>
            </q-td>

            <!-- Columna Código -->
            <q-td key="name" :props="props">
              <div class="column">
                <span class="text-weight-bold text-dark text-body2">
                  {{ props.row.name }}
                </span>
                <span class="text-caption text-primary text-weight-medium">
                  Código: {{ props.row.code }}
                </span>
                <span class="text-caption text-grey-6" v-if="props.row.sat_product_code">
                  SAT: {{ props.row.sat_product_code }}
                </span>
              </div>
            </q-td>

            <!-- Columna Clasificación-->
            <q-td key="classification" :props="props">
              <div class="column">
                <span class="text-weight-bold text-dark">{{ props.row.category_id || 'Sin categoría' }}</span>
                <span class="text-caption text-grey-7" v-if="props.row.subcategory_id">Subcategoría: {{ props.row.subcategory_id }}</span>
              </div>
            </q-td>

            <!-- Columna Precios -->
            <q-td key="pricing" :props="props">
              <div class="column">
                <span class="text-weight-bold text-dark">Venta: ${{ Number(props.row.retail_price).toFixed(2) }}</span>
                <span class="text-caption text-grey-7">Costo: ${{ Number(props.row.cost || 0).toFixed(2) }}</span>
              </div>
            </q-td>

            <!-- Columna Stock -->
            <q-td key="stock" :props="props">
              <div class="column items-start">
                <q-badge :color="props.row.stock_quantity <= (props.row.minimum_stock || 0) ? 'negative' : 'positive'" class="text-weight-bold q-px-sm">
                  Stock: {{ props.row.stock_quantity }}
                </q-badge>
                <span class="text-caption text-grey-6 q-mt-xs" v-if="props.row.storage_location">
                  Ubicación: {{ props.row.storage_location }}
                </span>
              </div>
            </q-td>

            <!-- Columna Estado -->
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
                  <q-tooltip>Editar producto</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.is_active"
                  flat
                  round
                  dense
                  color="negative"
                  icon="inventory"
                  class="action-btn"
                  @click="confirmToggleStatus(props.row)"
                >
                  <q-tooltip>Desactivar producto</q-tooltip>
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
                  <q-tooltip>Activar producto</q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  class="action-btn"
                  @click="confirmDeleteProduct(props.row)"
                >
                  <q-tooltip>Eliminar definitivamente</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>

          <!-- FILA EXPANDIBLE: SECCIONES DETALLADAS DEL PRODUCTO -->
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" class="bg-grey-1 q-pa-md">
              <div class="row q-col-gutter-md">
                <!-- Sección 1: Información Fiscal y Códigos -->
                <div class="col-12 col-md-4">
                  <q-card flat class="q-pa-sm border-radius-8 bg-white card-border h-100">
                    <div class="text-weight-bold text-primary q-mb-xs row items-center">
                      <q-icon name="qr_code" size="18px" class="q-mr-xs" /> Identificación y SAT
                    </div>
                    <div class="text-caption text-grey-8"><b>Código de Barras:</b> {{ props.row.barcode || 'No registrado' }}</div>
                    <div class="text-caption text-grey-8"><b>Clave Prod. SAT:</b> {{ props.row.sat_product_code || 'No especificado' }}</div>
                    <div class="text-caption text-grey-8"><b>Objeto Impuesto:</b> {{ props.row.tax_object_code || 'No especificado' }}</div>
                    <div class="text-caption text-grey-8"><b>Tipo de Producto:</b> {{ props.row.product_type || 'General' }}</div>
                  </q-card>
                </div>

                <!-- Inventario y Almacén -->
                <div class="col-12 col-md-4">
                  <q-card flat class="q-pa-sm border-radius-8 bg-white card-border h-100">
                    <div class="text-weight-bold text-primary q-mb-xs row items-center">
                      <q-icon name="warehouse" size="18px" class="q-mr-xs" /> Control de Inventario
                    </div>
                    <div class="text-caption text-grey-8"><b>Controla Stock:</b> {{ props.row.track_inventory ? 'Sí' : 'No' }}</div>
                    <div class="text-caption text-grey-8"><b>Stock Mínimo:</b> {{ props.row.minimum_stock ?? 'N/D' }}</div>
                    <div class="text-caption text-grey-8"><b>Ubicación:</b> {{ props.row.storage_location || 'No especificada' }}</div>
                    <div class="text-caption text-grey-8"><b>Precio Mayoreo:</b> ${{ Number(props.row.wholesale_price || 0).toFixed(2) }}</div>
                    <div class="text-caption text-grey-8"><b>Ruta Imagen:</b> {{ props.row.image_path || 'No especificada' }}</div>
                  </q-card>
                </div>

                <!-- Descripción y Notas -->
                <div class="col-12 col-md-4">
                  <q-card flat class="q-pa-sm border-radius-8 bg-white card-border h-100">
                    <div class="text-weight-bold text-primary q-mb-xs row items-center">
                      <q-icon name="description" size="18px" class="q-mr-xs" /> Descripción y Detalles
                    </div>
                    <div class="text-caption text-grey-7"><b>Categoría:</b> {{ props.row.category_id || 'No especificada' }}</div>
                    <div class="text-caption text-grey-7"><b>Subcategoría:</b> {{ props.row.subcategory_id || 'No especificada' }}</div>
                    <div class="text-caption text-grey-7"><b>Marca:</b> {{ props.row.brand_id || 'No especificada' }}</div>
                    <div class="text-caption text-grey-7"><b>Unidad:</b> {{ props.row.unit_id || 'No especificada' }}</div>
                    <div class="text-caption text-grey-7"><b>Descripción:</b> {{ props.row.description || 'Sin descripción detallada.' }}</div>
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

    <!-- Componente Modal para Crear/Editar Producto -->
    <ProductFormDialog
      v-model="dialogVisible"
      :product="selectedProduct"
      @saved="onProductSaved"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import ProductFormDialog from '@/components/products/ProductFormDialog.vue'

const $q = useQuasar()

const loading = ref(false)
const products = ref([])
const totalProducts = ref(0)

const dialogVisible = ref(false)
const selectedProduct = ref(null)

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
  sortBy: 'description',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  { name: 'expand', label: '', align: 'center', field: 'expand', sortable: false },
  { name: 'name', label: 'Producto / Código', align: 'left', field: 'code', sortable: true },
  { name: 'classification', label: 'Clasificación', align: 'left', field: 'category_id' },
  { name: 'pricing', label: 'Precios', align: 'left', field: 'retail_price', sortable: true },
  { name: 'stock', label: 'Inventario', align: 'left', field: 'stock_quantity', sortable: true },
  { name: 'status', label: 'Estado', align: 'left', field: 'is_active', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'right' },
]

// Cargar productos con filtros y paginación desde el backend
async function loadProducts() {
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

    const response = await api.get('/products', { params })

    if (response.data?.success) {
      products.value = response.data.data
      const meta = response.data.meta
      pagination.value.rowsNumber = meta.total
      totalProducts.value = meta.total
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al cargar el listado de productos.',
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
  loadProducts()
}

function openCreateDialog() {
  selectedProduct.value = null
  dialogVisible.value = true
}

function openEditDialog(product) {
  selectedProduct.value = { ...product }
  dialogVisible.value = true
}

function onProductSaved() {
  loadProducts()
}

function confirmToggleStatus(product) {
  const willDeactivate = Boolean(product.is_active)
  const actionText = willDeactivate ? 'desactivar' : 'activar'
  const actionColor = willDeactivate ? 'negative' : 'positive'

  $q.dialog({
    title: willDeactivate ? 'Desactivar Producto' : 'Activar Producto',
    message: willDeactivate
      ? `¿Está seguro de que desea desactivar el producto "${product.name}"?`
      : `¿Desea reactivar el producto "${product.name}"?`,
    cancel: { flat: true, label: 'Cancelar', color: 'grey-7' },
    ok: { label: willDeactivate ? 'Sí, Desactivar' : 'Sí, Activar', color: actionColor },
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await api.patch(`/products/${product.id}/toggle-status`)
      $q.notify({
        type: 'positive',
        message: response.data.message || `Producto ${actionText}do correctamente.`,
        position: 'top-right',
        icon: 'check_circle',
      })
      loadProducts()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo cambiar el estado del producto.',
        position: 'top-right',
        icon: 'error',
      })
    }
  })
}

function confirmDeleteProduct(product) {
  $q.dialog({
    title: 'Eliminar Producto',
    message: `¿Estás completamente seguro de eliminar permanentemente el producto "${product.name}"? Esta acción no se puede deshacer.`,
    cancel: { flat: true, label: 'Cancelar', color: 'grey-7' },
    ok: { label: 'Sí, Eliminar', color: 'negative' },
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await api.delete(`/products/${product.id}`)
      $q.notify({
        type: 'positive',
        message: response.data.message || 'Producto eliminado correctamente.',
        position: 'top-right',
        icon: 'check_circle',
      })
      loadProducts()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo eliminar el producto.',
        position: 'top-right',
        icon: 'error',
      })
    }
  })
}

onMounted(() => {
  loadProducts()
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

.products-table {
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