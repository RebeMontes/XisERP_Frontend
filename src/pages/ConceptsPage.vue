<template>
  <q-page class="q-pa-lg">
    <!-- Header General -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bolder text-dark row items-center">
        <q-avatar size="38px" color="primary" text-color="white" class="q-mr-sm shadow-2">
          <q-icon name="dashboard_customize" size="24px" />
        </q-avatar>
        Panel de Conceptos y Catálogos
      </div>
      <div class="text-caption text-grey-8 q-mt-xs">
        Administración centralizada de catálogos auxiliares del sistema
      </div>
    </div>

    <!-- CONTENEDOR DE TABLAS-->
    <div class="column q-gutter-y-lg">

      <!-- TABLA: UNIDADES -->
      <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
        <div class="row items-center justify-between q-pa-md bg-grey-1 border-bottom">
          <div class="text-subtitle1 text-weight-bold text-dark row items-center">
            <q-icon name="straighten" color="primary" size="20px" class="q-mr-xs" />
            Unidades de Medida
            <q-badge color="blue-1" text-color="primary" class="q-ml-sm">
              {{ units.length }}
            </q-badge>
          </div>
          <q-btn
            color="secondary"
            icon="add"
            label="Nueva Unidad"
            size="sm"
            no-caps
            unelevated
            class="border-radius-8 text-weight-bold"
            @click="addUnitRow"
          />
        </div>

        <q-table
          :rows="units"
          :columns="columns"
          row-key="id"
          :loading="loadingUnits"
          flat
          dense
          hide-pagination
          :rows-per-page-options="[0]"
          no-data-label="No hay unidades registradas"
          class="concept-subtable"
        >
          <template #body-cell-name="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.name ? 'text-weight-bold text-dark' : 'text-grey-5 text-italic'">
                  {{ props.row.name || 'Escribe un nombre...' }}
                </span>
                <q-icon name="edit" size="12px" color="primary" />
              </div>
              <q-popup-edit v-model="props.row.name" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveUnitEdit(props.row, 'name', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="100" label="Nombre" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-symbol="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.symbol ? 'text-primary text-weight-medium' : 'text-grey-5 text-italic'">
                  {{ props.row.symbol || 'Símbolo...' }}
                </span>
                <q-icon name="edit" size="12px" color="grey-6" />
              </div>
              <q-popup-edit v-model="props.row.symbol" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveUnitEdit(props.row, 'symbol', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="30" label="Símbolo" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-sat_unit_code="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.sat_unit_code ? 'text-grey-8' : 'text-grey-5 text-italic'">
                  {{ props.row.sat_unit_code || 'Sin descripción...' }}
                </span>
                <q-icon name="edit" size="12px" color="grey-6" />
              </div>
              <q-popup-edit v-model="props.row.sat_unit_code" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveUnitEdit(props.row, 'sat_unit_code', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="255" label="Clave de unidad de medida" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-is_active="props">
            <q-td :props="props" class="text-center">
              <q-toggle v-model="props.row.is_active" :true-value="1" :false-value="0" color="positive" dense @update:model-value="(val) => saveUnitEdit(props.row, 'is_active', val)" />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteUnit(props.row, props.rowIndex)" />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- TABLA: CATEGORÍAS -->
      <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
        <div class="row items-center justify-between q-pa-md bg-grey-1 border-bottom">
          <div class="text-subtitle1 text-weight-bold text-dark row items-center">
            <q-icon name="straighten" color="primary" size="20px" class="q-mr-xs" />
            Categorías
            <q-badge color="blue-1" text-color="primary" class="q-ml-sm">
              {{ categories.length }}
            </q-badge>
          </div>
          <q-btn
            color="secondary"
            icon="add"
            label="Nueva Categoría"
            size="sm"
            no-caps
            unelevated
            class="border-radius-8 text-weight-bold"
            @click="addCategoryRow"
          />
        </div>

        <q-table
          :rows="categories"
          :columns="categoryColumns"
          row-key="id"
          :loading="loadingCategories"
          flat
          dense
          hide-pagination
          :rows-per-page-options="[0]"
          no-data-label="No hay unidades registradas"
          class="concept-subtable"
        >
          <template #body-cell-name="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.name ? 'text-weight-bold text-dark' : 'text-grey-5 text-italic'">
                  {{ props.row.name || 'Escribe un nombre...' }}
                </span>
                <q-icon name="edit" size="12px" color="primary" />
              </div>
              <q-popup-edit v-model="props.row.name" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveCategoryEdit(props.row, 'name', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="100" label="Nombre" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-code="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.code ? 'text-primary text-weight-medium' : 'text-grey-5 text-italic'">
                  {{ props.row.code || 'Código...' }}
                </span>
                <q-icon name="edit" size="12px" color="grey-6" />
              </div>
              <q-popup-edit v-model="props.row.code" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveCategoryEdit(props.row, 'code', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="30" label="Código" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-description="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.description ? 'text-grey-8' : 'text-grey-5 text-italic'">
                  {{ props.row.description || 'Sin descripción...' }}
                </span>
                <q-icon name="edit" size="12px" color="grey-6" />
              </div>
              <q-popup-edit v-model="props.row.description" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveCategoryEdit(props.row, 'description', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="255" label="Descripción" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-is_active="props">
            <q-td :props="props" class="text-center">
              <q-toggle v-model="props.row.is_active" :true-value="1" :false-value="0" color="positive" dense @update:model-value="(val) => saveCategoryEdit(props.row, 'is_active', val)" />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteCategory(props.row, props.rowIndex)" />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- TABLA: TIPO SUBCATEGORÍAS -->
      <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
        <div class="row items-center justify-between q-pa-md bg-grey-1 border-bottom">
          <div class="text-subtitle1 text-weight-bold text-dark row items-center">
            <q-icon name="straighten" color="primary" size="20px" class="q-mr-xs" />
            Subcategorías
            <q-badge color="blue-1" text-color="primary" class="q-ml-sm">
              {{ subcategories.length }}
            </q-badge>
          </div>
          <q-btn
            color="secondary"
            icon="add"
            label="Nueva Subcategoría"
            size="sm"
            no-caps
            unelevated
            class="border-radius-8 text-weight-bold"
            @click="addSubcategoryRow"
          />
        </div>

        <q-table
          :rows="subcategories"
          :columns="subcategoryColumns"
          row-key="id"
          :loading="loadingSubcategories"
          flat
          dense
          hide-pagination
          :rows-per-page-options="[0]"
          no-data-label="No hay subcategorías registradas"
          class="concept-subtable"
        >

        <template #body-cell-category_id="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.category_id ? 'text-primary text-weight-medium' : 'text-grey-5 text-italic'">
                  {{ getCategoryName(props.row.category_id) || 'Categoría...' }}
                </span>
                <q-icon name="edit" size="12px" color="grey-6" />
              </div>
              
              <q-popup-edit 
                v-model="props.row.category_id" 
                #default="scope" 
                auto-save 
                buttons 
                label-set="Guardar" 
                label-cancel="Cancelar" 
                @save="(val) => saveSubcategoryEdit(props.row, 'category_id', val)"
              >
                <q-select 
                  v-model="scope.value" 
                  :options=categories 
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  dense 
                  autofocus 
                  outlined 
                  label="Selecciona una categoría" 
                />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-name="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.name ? 'text-weight-bold text-dark' : 'text-grey-5 text-italic'">
                  {{ props.row.name || 'Escribe un nombre...' }}
                </span>
                <q-icon name="edit" size="12px" color="primary" />
              </div>
              <q-popup-edit v-model="props.row.name" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveSubcategoryEdit(props.row, 'name', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="100" label="Nombre" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-code="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.code ? 'text-primary text-weight-medium' : 'text-grey-5 text-italic'">
                  {{ props.row.code || 'Código...' }}
                </span>
                <q-icon name="edit" size="12px" color="grey-6" />
              </div>
              <q-popup-edit v-model="props.row.code" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveSubcategoryEdit(props.row, 'code', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="30" label="Código" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-is_active="props">
            <q-td :props="props" class="text-center">
              <q-toggle v-model="props.row.is_active" :true-value="1" :false-value="0" color="positive" dense @update:model-value="(val) => saveSubcategoryEdit(props.row, 'is_active', val)" />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteSubcategory(props.row, props.rowIndex)" />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- TABLA: MARCAS -->
      <q-card flat class="border-radius-12 bg-white card-border shadow-1 overflow-hidden">
        <div class="row items-center justify-between q-pa-md bg-grey-1 border-bottom">
          <div class="text-subtitle1 text-weight-bold text-dark row items-center">
            <q-icon name="straighten" color="primary" size="20px" class="q-mr-xs" />
            Marcas
            <q-badge color="blue-1" text-color="primary" class="q-ml-sm">
              {{ brands.length }}
            </q-badge>
          </div>
          <q-btn
            color="secondary"
            icon="add"
            label="Nueva Marca"
            size="sm"
            no-caps
            unelevated
            class="border-radius-8 text-weight-bold"
            @click="addBrandRow"
          />
        </div>

        <q-table
          :rows="brands"
          :columns="brandColumns"
          row-key="id"
          :loading="loadingBrands"
          flat
          dense
          hide-pagination
          :rows-per-page-options="[0]"
          no-data-label="No hay marcas registradas"
          class="concept-subtable"
        >
          <template #body-cell-name="props">
            <q-td :props="props" class="cursor-pointer">
              <div class="row items-center justify-between no-wrap">
                <span :class="props.row.name ? 'text-weight-bold text-dark' : 'text-grey-5 text-italic'">
                  {{ props.row.name || 'Escribe un nombre...' }}
                </span>
                <q-icon name="edit" size="12px" color="primary" />
              </div>
              <q-popup-edit v-model="props.row.name" #default="scope" auto-save buttons label-set="Guardar" label-cancel="Cancelar" @save="(val) => saveBrandEdit(props.row, 'name', val)">
                <q-input v-model="scope.value" dense autofocus outlined maxlength="100" label="Nombre" />
              </q-popup-edit>
            </q-td>
          </template>

          <template #body-cell-is_active="props">
            <q-td :props="props" class="text-center">
              <q-toggle v-model="props.row.is_active" :true-value="1" :false-value="0" color="positive" dense @update:model-value="(val) => saveBrandEdit(props.row, 'is_active', val)" />
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteBrand(props.row, props.rowIndex)" />
            </q-td>
          </template>
        </q-table>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

const $q = useQuasar()

// ESTADOS Y LÓGICA PARA UNIDADES
const units = ref([])
const loadingUnits = ref(false)

const columns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'symbol', label: 'Símbolo', align: 'left', field: 'symbol' },
  { name: 'sat_unit_code', label: 'Clave de unidad de medida', align: 'left', field: 'sat_unit_code' },
  { name: 'is_active', label: 'Activo', align: 'center', field: 'is_active' },
  { name: 'actions', label: '', align: 'right' }
]

async function loadUnits() {
  loadingUnits.value = true
  try {
    const res = await api.get('/units') // Apunta a UnitController@index
    if (res.data?.success) units.value = res.data.data
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al cargar unidades', position: 'top-right' })
  } finally {
    loadingUnits.value = false
  }
}

function addUnitRow() {
  units.value.unshift({ id: null, name: '', symbol: '', sat_unit_code: '', is_active: 1, isNew: true })
}

async function saveUnitEdit(row, field, newValue) {
  row[field] = newValue
  try {
    if (!row.id) {
      const res = await api.post('/units', { // Apunta a UnitController@store
        name: row.name, symbol: row.symbol, sat_unit_code: row.sat_unit_code, is_active: row.is_active
      })
      if (res.data?.success) {
        row.id = res.data.data.id
        delete row.isNew
        $q.notify({ type: 'positive', message: 'Unidad creada', position: 'top-right', timeout: 1000 })
      }
    } else {
      await api.put(`/units/${row.id}`, { // Apunta a UnitController@update
        name: row.name, symbol: row.symbol, sat_unit_code: row.sat_unit_code, is_active: row.is_active
      })
      $q.notify({ type: 'positive', message: 'Unidad actualizada', position: 'top-right', timeout: 1000 })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al guardar', position: 'top-right' })
  }
}

async function deleteUnit(row, index) {
  if (!row.id) { units.value.splice(index, 1); return; }
  try {
    await api.delete(`/units/${row.id}`) // Apunta a UnitController@destroy
    units.value.splice(index, 1)
    $q.notify({ type: 'positive', message: 'Unidad eliminada', position: 'top-right', timeout: 1000 })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'No se pudo eliminar', position: 'top-right' })
  }
}

// ESTADOS Y LÓGICA PARA CATEGORÍAS
const categories = ref([])
const loadingCategories = ref(false)

const categoryColumns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'code', label: 'Código', align: 'left', field: 'code' },
  { name: 'description', label: 'Descripción', align: 'left', field: 'description' },
  { name: 'is_active', label: 'Activo', align: 'center', field: 'is_active' },
  { name: 'actions', label: '', align: 'right' }
]

async function loadCategories() {
  loadingCategories.value = true
  try {
    const res = await api.get('/categories') // Apunta a CategoryController@index
    if (res.data?.success) categories.value = res.data.data
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al cargar categorías', position: 'top-right' })
  } finally {
    loadingCategories.value = false
  }
}

async function addCategoryRow() {
  categories.value.unshift({ id: null, name: '', code: '', description: '', is_active: 1, isNew: true })
}

async function saveCategoryEdit(row, field, newValue) {
  row[field] = newValue
  try {
    if (!row.id) {
      const res = await api.post('/categories', { // Apunta a CategoryController@store
        name: row.name, code: row.code, description: row.description, is_active: row.is_active
      })
      if (res.data?.success) {
        row.id = res.data.data.id
        delete row.isNew
        $q.notify({ type: 'positive', message: 'Categoría creada', position: 'top-right', timeout: 1000 })
      }
    } else {
      await api.put(`/categories/${row.id}`, { // Apunta a CategoryController@update
        name: row.name, code: row.code, description: row.description, is_active: row.is_active
      })
      $q.notify({ type: 'positive', message: 'Categoría actualizada', position: 'top-right', timeout: 1000 })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al guardar', position: 'top-right' })
  }
}

async function deleteCategory(row, index) {
  if (!row.id) { categories.value.splice(index, 1); return; }
  try {
    await api.delete(`/categories/${row.id}`) // Apunta a CategoryController@destroy
    categories.value.splice(index, 1)
    $q.notify({ type: 'positive', message: 'Categoría eliminada', position: 'top-right', timeout: 1000 })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'No se pudo eliminar', position: 'top-right' })
  }
}

// ESTADOS Y LÓGICA PARA SUBCATEGORÍAS
const subcategories = ref([])
const loadingSubcategories = ref(false)

const subcategoryColumns = [
  { name: 'category_id', label: 'Categoría', align: 'left', field: 'category_id' },
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'code', label: 'Código', align: 'left', field: 'code' },
  { name: 'is_active', label: 'Activo', align: 'center', field: 'is_active' },
  { name: 'actions', label: '', align: 'right' }
]

function getCategoryName(categoryId) {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : null
}

async function loadSubcategories() {
  loadingSubcategories.value = true
  try {
    const res = await api.get('/subcategories') // Apunta a SubcategoryController@index
    if (res.data?.success) subcategories.value = res.data.data
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al cargar subcategorías', position: 'top-right' })
  } finally {
    loadingSubcategories.value = false
  }
}

async function addSubcategoryRow() {
  subcategories.value.unshift({ id: null, category_id: categories.value.length > 0 ? categories.value[0].id : null, name: '', code: '', is_active: 1, isNew: true })
}

async function saveSubcategoryEdit(row, field, newValue) {
  row[field] = newValue
  try {
    if (!row.id) {
      const res = await api.post('/subcategories', { // Apunta a SubcategoryController@store
        category_id: row.category_id, name: row.name, code: row.code, is_active: row.is_active
      })
      if (res.data?.success) {
        row.id = res.data.data.id
        delete row.isNew
        $q.notify({ type: 'positive', message: 'Subcategoría creada', position: 'top-right', timeout: 1000 })
      }
    } else {
      await api.put(`/subcategories/${row.id}`, { // Apunta a SubcategoryController@update
        category_id: row.category_id, name: row.name, code: row.code, is_active: row.is_active
      })
      $q.notify({ type: 'positive', message: 'Subcategoría actualizada', position: 'top-right', timeout: 1000 })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al guardar', position: 'top-right' })
  }
}

async function deleteSubcategory(row, index) {
  if (!row.id) { subcategories.value.splice(index, 1); return; }
  try {
    await api.delete(`/subcategories/${row.id}`) // Apunta a SubcategoryController@destroy
    subcategories.value.splice(index, 1)
    $q.notify({ type: 'positive', message: 'Subcategoría eliminada', position: 'top-right', timeout: 1000 })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'No se pudo eliminar', position: 'top-right' })
  }
}

// ESTADOS Y LÓGICA PARA MARCAS
const brands = ref([])
const loadingBrands = ref(false)

const brandColumns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'is_active', label: 'Activo', align: 'center', field: 'is_active' },
  { name: 'actions', label: '', align: 'right' }
]

async function loadBrands() {
  loadingBrands.value = true
  try {
    const res = await api.get('/brands') // Apunta a BrandController@index
    if (res.data?.success) brands.value = res.data.data
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al cargar marcas', position: 'top-right' })
  } finally {
    loadingBrands.value = false
  }
}

function addBrandRow() {
  brands.value.unshift({ id: null, name: '', is_active: 1, isNew: true })
}

async function saveBrandEdit(row, field, newValue) {
  row[field] = newValue
  try {
    if (!row.id) {
      const res = await api.post('/brands', { // Apunta a BrandController@store
        name: row.name, is_active: row.is_active
      })
      if (res.data?.success) {
        row.id = res.data.data.id
        delete row.isNew
        $q.notify({ type: 'positive', message: 'Marca creada', position: 'top-right', timeout: 1000 })
      }
    } else {
      await api.put(`/brands/${row.id}`, { // Apunta a BrandController@update
        name: row.name, is_active: row.is_active
      })
      $q.notify({ type: 'positive', message: 'Marca actualizada', position: 'top-right', timeout: 1000 })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al guardar', position: 'top-right' })
  }
}

async function deleteBrand(row, index) {
  if (!row.id) { brands.value.splice(index, 1); return; }
  try {
    await api.delete(`/brands/${row.id}`) // Apunta a BrandController@destroy
    brands.value.splice(index, 1)
    $q.notify({ type: 'positive', message: 'Marca eliminada', position: 'top-right', timeout: 1000 })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'No se pudo eliminar', position: 'top-right' })
  }
}

onMounted(() => {
  loadUnits()
  loadCategories()
  loadSubcategories()
  loadBrands()
})
</script>

<style scoped lang="scss">
.border-radius-8 { border-radius: 8px; }
.border-radius-12 { border-radius: 12px; }
.card-border { border: 1px solid #cbd5e1; }
.border-bottom { border-bottom: 1px solid #cbd5e1; }
.concept-subtable {
  :deep(thead tr th) { font-weight: 700; color: #475569; background-color: #f8fafc; font-size: 11px; }
  :deep(tbody tr:hover) { background-color: #f1f5f9; }
}
</style>