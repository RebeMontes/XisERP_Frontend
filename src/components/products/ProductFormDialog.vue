<template>
  <q-dialog v-model="isOpen" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 850px; max-width: 95vw;" class="border-radius-12 bg-white">
      <!-- Encabezado del Modal -->
      <q-card-section class="row items-center justify-between q-pb-sm border-bottom">
        <div class="text-h6 text-weight-bold text-dark row items-center">
          <q-icon name="inventory_2" color="primary" class="q-mr-xs" size="24px" />
          {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
        </div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <!-- Formulario con Pestañas -->
      <q-form @submit="onSubmit">
        <q-card-section class="q-pa-md">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey-8"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="general" icon="description" label="General y Fiscal" />
            <q-tab name="classification" icon="category" label="Clasificación" />
            <q-tab name="pricing" icon="attach_money" label="Precios e Inventario" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated class="q-pt-md">
            
            <!-- PESTAÑA 1: GENERAL Y FISCAL -->
            <q-tab-panel name="general" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.code"
                    label="Código / SKU *"
                    outlined
                    dense
                    placeholder="Ej. PROD-001"
                    :rules="[val => !!val || 'El código es obligatorio']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.sat_product_code"
                    label="Clave Producto SAT"
                    outlined
                    dense
                    placeholder="Ej. 01010101"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.product_type"
                    label="Tipo de Producto"
                    outlined
                    dense
                    placeholder="Ej. General / Servicio"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.tax_object_code"
                    label="Objeto de Impuesto SAT"
                    outlined
                    dense
                    placeholder="Ej. 02 - Sí objeto de impuesto"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.description"
                    label="Descripción"
                    outlined
                    dense
                    type="textarea"
                    rows="2"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- PESTAÑA 2: CLASIFICACIÓN Y CATÁLOGOS -->
            <q-tab-panel name="classification" class="q-pa-none">
              <div class="row q-col-gutter-md">
                
                <!-- CATEGORÍA -->
                <div class="col-12 col-sm-6">
                  <div class="row q-gutter-x-sm items-center no-wrap">
                    <div class="col">
                      <q-select
                        v-model="form.category_id"
                        :options="categoryOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        outlined
                        dense
                        label="Categoría *"
                        :rules="[val => !!val || 'Selecciona una categoría']"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn color="primary" icon="add" round dense unelevated class="q-mb-md" @click="openQuickAddModal('category')" title="Nueva Categoría" />
                    </div>
                  </div>
                </div>

                <!-- SUBCATEGORÍA -->
                <div class="col-12 col-sm-6">
                  <div class="row q-gutter-x-sm items-center no-wrap">
                    <div class="col">
                      <q-select
                        v-model="form.subcategory_id"
                        :options="subcategoryOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        outlined
                        dense
                        label="Subcategoría"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn color="primary" icon="add" round dense unelevated @click="openQuickAddModal('subcategory')" title="Nueva Subcategoría" />
                    </div>
                  </div>
                </div>

                <!-- MARCA -->
                <div class="col-12 col-sm-6">
                  <div class="row q-gutter-x-sm items-center no-wrap">
                    <div class="col">
                      <q-select
                        v-model="form.brand_id"
                        :options="brandOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        outlined
                        dense
                        label="Marca"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn color="primary" icon="add" round dense unelevated @click="openQuickAddModal('brand')" title="Nueva Marca" />
                    </div>
                  </div>
                </div>

                <!-- UNIDAD-->
                <div class="col-12 col-sm-6">
                  <div class="row q-gutter-x-sm items-center no-wrap">
                    <div class="col">
                      <q-select
                        v-model="form.unit_id"
                        :options="unitOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        outlined
                        dense
                        label="Unidad"
                        :rules="[val => !!val || 'Selecciona una unidad']"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn color="primary" icon="add" round dense unelevated class="q-mb-md" @click="openQuickAddModal('unit')" title="Nueva Unidad" />
                    </div>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.storage_location"
                    label="Ubicación en Almacén / Bodega"
                    outlined
                    dense
                    placeholder="Ej. Pasillo 3, Estante B"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.image_path"
                    label="Ruta de la Imagen"
                    outlined
                    dense
                    placeholder="Ej. /images/producto.jpg"
                  />
                </div>

              </div>
            </q-tab-panel>

            <!-- PRECIOS E INVENTARIO -->
            <q-tab-panel name="pricing" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model.number="form.cost"
                    label="Costo ($)"
                    type="number"
                    step="0.01"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model.number="form.retail_price"
                    label="Precio Menudeo ($)"
                    type="number"
                    step="0.01"
                    outlined
                    dense
                    :rules="[val => val !== null && val !== '' || 'Obligatorio']"
                  />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model.number="form.wholesale_price"
                    label="Precio Mayoreo ($)"
                    type="number"
                    step="0.01"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model.number="form.stock_quantity"
                    label="Cantidad en Stock"
                    type="number"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model.number="form.minimum_stock"
                    label="Stock Mínimo"
                    type="number"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-4 flex items-center">
                  <q-toggle
                    v-model="form.track_inventory"
                    :true-value="1"
                    :false-value="0"
                    label="Lleva control de inventario"
                    color="primary"
                  />
                </div>
              </div>
            </q-tab-panel>

          </q-tab-panels>
        </q-card-section>

        <!-- Botones de Acción del Modal -->
        <q-card-actions align="right" class="q-pa-md bg-grey-1 border-top">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn
            type="submit"
            color="primary"
            :label="isEditing ? 'Guardar Cambios' : 'Registrar Producto'"
            no-caps
            unelevated
            :loading="saving"
            class="q-px-md border-radius-8"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  product: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const $q = useQuasar()
const saving = ref(false)
const tab = ref('general')

// Opciones para catálogos auxiliares
const categoryOptions = ref([])
const subcategoryOptions = ref([])
const brandOptions = ref([])
const unitOptions = ref([])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEditing = computed(() => Boolean(props.product && props.product.id))

// Objeto base alineado con los campos exactos de tu base de datos
const defaultForm = {
  code: '',
  sat_product_code: '',
  product_type: '',
  name: '',
  category_id: null,
  subcategory_id: null,
  brand_id: null,
  unit_id: null,
  description: '',
  cost: 0,
  retail_price: 0,
  wholesale_price: 0,
  tax_object_code: '',
  track_inventory: 1,
  stock_quantity: 0,
  minimum_stock: 0,
  storage_location: '',
  image_path: '',
  is_active: 1,
}

const form = reactive({ ...defaultForm })

// Configuración para los diálogos rápidos al vuelo
const catalogConfigs = {
  category: { title: 'Categoría', endpoint: '/categories', options: categoryOptions },
  subcategory: { title: 'Subcategoría', endpoint: '/subcategories', options: subcategoryOptions },
  brand: { title: 'Marca', endpoint: '/brands', options: brandOptions },
  unit: { title: 'Unidad', endpoint: '/units', options: unitOptions },
}

async function loadCatalogOptions(type) {
  const config = catalogConfigs[type]
  if (!config) return
  try {
    const res = await api.get(config.endpoint)
    if (res.data?.success) {
      config.options.value = res.data.data.map(item => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {
    console.error(`Error al cargar ${config.title}:`, error)
  }
}

async function loadAllCatalogs() {
  await Promise.all([
    loadCatalogOptions('category'),
    loadCatalogOptions('subcategory'),
    loadCatalogOptions('brand'),
    loadCatalogOptions('unit'),
  ])
}

// Función para crear registros "al vuelo"
// Temporal (Se mejorará para guardar todos los datos)
function openQuickAddModal(type) {
  const config = catalogConfigs[type]
  if (!config) return

  $q.dialog({
    title: `Nueva ${config.title}`,
    message: `Escribe el nombre de la nueva ${config.title.toLowerCase()}:`,
    prompt: { model: '', type: 'text' },
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Guardar', color: 'primary' }
  }).onOk(async (newName) => {
    if (!newName || newName.trim() === '') return

    try {
      const res = await api.post(config.endpoint, { name: newName, is_active: 1 })
      if (res.data?.success) {
        const created = res.data.data
        const newOption = { label: created.name, value: created.id }

        config.options.value.push(newOption)
        form[`${type}_id`] = created.id

        $q.notify({
          type: 'positive',
          message: `${config.title} creada y seleccionada.`,
          position: 'top-right',
          timeout: 1500
        })
      }
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || `Error al crear ${config.title.toLowerCase()}.`,
        position: 'top-right'
      })
    }
  })
}

watch(
  () => props.product,
  (newProd) => {
    tab.value = 'general'
    if (newProd) {
      Object.assign(form, defaultForm, newProd)
    } else {
      Object.assign(form, defaultForm)
    }
  },
  { immediate: true }
)

watch(isOpen, (newVal) => {
  if (newVal) loadAllCatalogs()
})

async function onSubmit() {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.put(`/products/${props.product.id}`, form)
      $q.notify({ type: 'positive', message: 'Producto actualizado correctamente.', position: 'top-right' })
    } else {
      await api.post('/products', form)
      $q.notify({ type: 'positive', message: 'Producto registrado correctamente.', position: 'top-right' })
    }
    emit('saved')
    isOpen.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar el producto.',
      position: 'top-right',
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAllCatalogs()
})
</script>

<style scoped>
.border-radius-8 { border-radius: 8px; }
.border-radius-12 { border-radius: 12px; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.border-top { border-top: 1px solid #e2e8f0; }
</style>