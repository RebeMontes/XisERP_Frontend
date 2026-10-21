<template>
  <q-dialog v-model="isOpen" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 850px; max-width: 95vw;" class="border-radius-12 bg-white">
      <!-- Encabezado del Modal -->
      <q-card-section class="row items-center justify-between q-pb-sm border-bottom">
        <div class="text-h6 text-weight-bold text-dark row items-center">
          <q-icon name="business" color="primary" class="q-mr-xs" size="24px" />
          {{ isEditing ? 'Editar Empresa' : 'Nueva Empresa' }}
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
            <q-tab name="address" icon="place" label="Domicilio" />
            <q-tab name="contact" icon="contacts" label="Contacto y Notas" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated class="q-pt-md">
            <!-- PESTAÑA 1: DATOS GENERALES Y FISCALES -->
            <q-tab-panel name="general" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.tax_id"
                    label="RFC / Tax ID"
                    outlined
                    dense
                    placeholder="Ej. XAXX010101000"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.legal_name"
                    label="Razón Social / Nombre Legal *"
                    outlined
                    dense
                    :rules="[val => !!val || 'El nombre o razón social es obligatorio']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.trade_name"
                    label="Nombre Comercial"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.personal_id"
                    label="CURP / Personal ID"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.tax_regime"
                    label="Régimen Fiscal"
                    outlined
                    dense
                    placeholder="Ej. 601 - General de Ley Personas Morales"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- PESTAÑA 2: DOMICILIO -->
            <q-tab-panel name="address" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-8">
                  <q-input v-model="form.street" label="Calle" outlined dense />
                </div>
                <div class="col-6 col-sm-2">
                  <q-input v-model="form.exterior_num" label="N° Ext." outlined dense />
                </div>
                <div class="col-6 col-sm-2">
                  <q-input v-model="form.interior_num" label="N° Int." outlined dense />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.neighborhood" label="Colonia / Fraccionamiento" outlined dense />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.city" label="Ciudad" outlined dense />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.municipality" label="Municipio / Alcaldía" outlined dense />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.state" label="Estado" outlined dense />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.country" label="País" outlined dense />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.postal_code" label="Código Postal" outlined dense />
                </div>
                <div class="col-12 col-sm-8">
                  <q-input v-model="form.address_references" label="Referencias de Dirección" outlined dense />
                </div>
              </div>
            </q-tab-panel>

            <!-- PESTAÑA 3: CONTACTO Y NOTAS -->
            <q-tab-panel name="contact" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.contact_name" label="Nombre de Contacto Directo" outlined dense />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.email" label="Correo Electrónico" outlined dense type="email" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.phone" label="Teléfono" outlined dense />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.phone_type" label="Tipo de Teléfono" outlined dense placeholder="Ej. Móvil / Oficina" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.whatsapp" label="WhatsApp" outlined dense />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.notes"
                    label="Notas / Observaciones"
                    outlined
                    dense
                    type="textarea"
                    rows="3"
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
            :label="isEditing ? 'Guardar Cambios' : 'Registrar Empresa'"
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
import { ref, reactive, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  company: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const $q = useQuasar()
const saving = ref(false)
const tab = ref('general')

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEditing = computed(() => Boolean(props.company && props.company.id))

const defaultForm = {
  tax_id: '',
  tax_regime: '',
  legal_name: '',
  trade_name: '',
  personal_id: '',
  street: '',
  exterior_num: '',
  interior_num: '',
  neighborhood: '',
  city: '',
  municipality: '',
  state: '',
  country: 'México',
  postal_code: '',
  address_references: '',
  phone: '',
  phone_type: '',
  whatsapp: '',
  email: '',
  notes: '',
  is_active: true,
}

const form = reactive({ ...defaultForm })

watch(
  () => props.company,
  (newCompany) => {
    tab.value = 'general'
    if (newCompany) {
      Object.assign(form, defaultForm, newCompany)
    } else {
      Object.assign(form, defaultForm)
    }
  },
  { immediate: true }
)

async function onSubmit() {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.put(`/companies/${props.company.id}`, form)
      $q.notify({
        type: 'positive',
        message: 'Empresa actualizado correctamente.',
        position: 'top-right',
      })
    } else {
      await api.post('/companies', form)
      $q.notify({
        type: 'positive',
        message: 'Empresa creada correctamente.',
        position: 'top-right',
      })
    }
    emit('saved')
    isOpen.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Ocurrió un error al guardar la empresa.',
      position: 'top-right',
    })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}
.border-radius-12 {
  border-radius: 12px;
}
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
.border-top {
  border-top: 1px solid #e2e8f0;
}
</style>