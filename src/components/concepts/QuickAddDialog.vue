<template>
  <q-dialog v-model="isOpen" persistent @hide="resetForm">
    <q-card style="min-width: 350px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Nuevo/a {{ config.title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit="saveRecord" class="q-gutter-md">
          
          <!-- Categoría -->
          <template v-if="type === 'categories'">
            <q-input v-model="form.name" label="Nombre de la Categoría" outlined dense required />
            <q-input v-model="form.code" label="Código de la Categoría" outlined dense required />
            <q-input v-model="form.description" label="Descripción de la Categoría" outlined dense />
          </template>

          <!-- Subcategoría -->
          <template v-else-if="type === 'subcategories'">
            <q-select
              v-model="form.category_id"
              :options="categoriesOptions"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              label="Categoría a la que pertenece"
              outlined
              dense
            />
            <q-input v-model="form.name" label="Nombre de la Subcategoría" outlined dense required />
          </template>

          <!-- Marcas -->
          <template v-if="type === 'brands'">
            <q-input v-model="form.name" label="Nombre de la Marca" outlined dense required />
          </template>

          <!-- Si es Unidad: Pide clave SAT y nombre -->
          <template v-if="type === 'units'">
            <q-input v-model="form.name" label="Nombre de la Unidad" outlined dense required />
            <q-input v-model="form.symbol" label="Símbolo de la Unidad" outlined dense required />
            <q-input v-model="form.sat_unit_code" label="Clave SAT (ej. H87)" outlined dense required />
          </template>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" color="grey-7" flat v-close-popup />
            <q-btn label="Guardar" type="submit" color="primary" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { api } from '@/boot/axios'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  type: { type: String, required: true },
  categoriesOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'saved'])
const $q = useQuasar()
const loading = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const catalogConfigs = {
  categories: { title: 'Categoría', endpoint: '/categories' },
  brands: { title: 'Marca', endpoint: '/brands' },
  units: { title: 'Unidad de Medida', endpoint: '/units' },
  subcategories: { title: 'Subcategoría', endpoint: '/subcategories' }
}

const config = computed(() => catalogConfigs[props.type] || { title: 'Registro', endpoint: '' })

// Molde base para limpiar fácilmente con Object.assign
const defaultForm = { code: '', name: '', category_id: null, is_active: true, description: '', symbol: '', sat_unit_code: '' }
const form = reactive({ ...defaultForm })

function resetForm() {
  Object.assign(form, defaultForm)
}

async function saveRecord() {
  loading.value = true
  try {
    const res = await api.post(config.value.endpoint, form)
    const createdItem = res.data.data || res.data
    
    $q.notify({ type: 'positive', message: `${config.value.title} creada con éxito` })
    
    emit('saved', { type: props.type, item: createdItem })
    isOpen.value = false
  } catch (error) {
    $q.notify({ 
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar el registro.',
      position: 'top-right', })
  } finally {
    loading.value = false
  }
}
</script>