<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="onDialogClose"
    persistent
    max-width="520px"
  >
    <q-card class="user-dialog-card shadow-12 border-radius-16">
      <!-- Header con Identidad XIS -->
      <q-card-section class="dialog-header row items-center justify-between q-pa-md">
        <div class="row items-center no-wrap">
          <q-avatar
            size="44px"
            :color="isEdit ? 'primary' : 'secondary'"
            text-color="white"
            class="q-mr-md shadow-2"
          >
            <q-icon :name="isEdit ? 'edit' : 'person_add'" size="26px" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bolder text-white line-height-tight">
              {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </div>
            <div class="text-caption text-blue-1">
              {{
                isEdit
                  ? 'Actualice la información y rol del usuario'
                  : 'Registre una nueva cuenta para el ERP XIS'
              }}
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" text-color="white" v-close-popup />
      </q-card-section>

      <!-- Alerta de Errores -->
      <q-card-section v-if="serverError" class="q-px-lg q-pt-md q-pb-none">
        <q-banner dense rounded class="bg-red-1 text-negative border-negative">
          <template #avatar>
            <q-icon name="error_outline" color="negative" />
          </template>
          {{ serverError }}
        </q-banner>
      </q-card-section>

      <!-- Formulario -->
      <q-card-section class="q-px-lg q-py-md">
        <q-form @submit.prevent="submitForm" class="q-gutter-y-md">
          <!-- Nombre Completo -->
          <q-input
            v-model="form.name"
            label="Nombre Completo *"
            placeholder="Ej. Juan Pérez González"
            outlined
            dense
            :rules="[(val) => (val && val.trim().length > 0) || 'El nombre es obligatorio']"
          >
            <template #prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <!-- Correo Electrónico -->
          <q-input
            v-model="form.email"
            type="email"
            label="Correo Electrónico *"
            placeholder="usuario@dominio.com"
            outlined
            dense
            :rules="[
              (val) => !!val || 'El correo electrónico es obligatorio',
              (val) => /.+@.+\..+/.test(val) || 'Ingrese un correo electrónico válido',
            ]"
          >
            <template #prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <!-- Rol en el ERP -->
          <q-select
            v-model="form.role"
            :options="roleOptions"
            emit-value
            map-options
            label="Rol / Permisos en el Sistema *"
            outlined
            dense
            :rules="[(val) => !!val || 'Debe seleccionar un rol']"
          >
            <template #prepend>
              <q-icon name="admin_panel_settings" color="primary" />
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" :color="scope.opt.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Contraseña -->
          <q-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :label="isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña de Acceso *'"
            :placeholder="isEdit ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'"
            outlined
            dense
            :rules="[
              (val) =>
                isEdit ||
                (val && val.length >= 6) ||
                'La contraseña debe tener al menos 6 caracteres',
              (val) =>
                !isEdit ||
                !val ||
                val.length >= 6 ||
                'Si ingresa contraseña, debe tener al menos 6 caracteres',
            ]"
          >
            <template #prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Toggle Estado de la cuenta -->
          <div
            class="row items-center justify-between q-pa-sm bg-grey-1 border-radius-8 border-soft"
          >
            <div class="column">
              <span class="text-weight-bold text-caption text-dark">
                {{ form.is_active ? 'Usuario Activo' : 'Usuario Inactivo' }}
              </span>
              <span class="text-caption text-grey-7" style="font-size: 11px">
                {{
                  form.is_active
                    ? 'Puede ingresar al sistema y realizar operaciones'
                    : 'Acceso suspendido al ERP'
                }}
              </span>
            </div>
            <q-toggle v-model="form.is_active" color="secondary" keep-color size="md" />
          </div>

          <!-- Botones de Acción -->
          <div class="row justify-end q-gutter-sm q-pt-sm">
            <q-btn flat label="Cancelar" color="grey-8" no-caps v-close-popup />
            <q-btn
              type="submit"
              :color="isEdit ? 'primary' : 'secondary'"
              :label="isEdit ? 'Actualizar Usuario' : 'Crear Usuario'"
              :icon="isEdit ? 'save' : 'person_add'"
              no-caps
              unelevated
              :loading="saving"
              class="border-radius-8 text-weight-bold px-lg"
            >
              <template #loading>
                <q-spinner-dots class="on-left" />
                Guardando...
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const $q = useQuasar()
const isEdit = computed(() => !!props.user?.id)

const showPassword = ref(false)
const saving = ref(false)
const serverError = ref('')

const roleOptions = [
  {
    label: 'Administrador',
    value: 'admin',
    icon: 'admin_panel_settings',
    color: 'primary',
    description: 'Acceso total y configuración del ERP',
  },
  {
    label: 'Técnico',
    value: 'technician',
    icon: 'engineering',
    color: 'secondary',
    description: 'Recepción, diagnóstico y reparación de equipos',
  },
]

const form = reactive({
  name: '',
  email: '',
  role: 'technician',
  password: '',
  is_active: true,
})

watch(
  () => props.user,
  (newUser) => {
    serverError.value = ''
    showPassword.value = false
    if (newUser) {
      form.name = newUser.name || ''
      form.email = newUser.email || ''
      form.role = newUser.role || 'technician'
      form.password = ''
      form.is_active = newUser.is_active !== undefined ? Boolean(newUser.is_active) : true
    } else {
      form.name = ''
      form.email = ''
      form.role = 'technician'
      form.password = ''
      form.is_active = true
    }
  },
  { immediate: true },
)

function onDialogClose(val) {
  emit('update:modelValue', val)
}

async function submitForm() {
  serverError.value = ''
  saving.value = true

  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    role: form.role,
    is_active: form.is_active,
  }

  if (form.password && form.password.trim().length > 0) {
    payload.password = form.password.trim()
  }

  try {
    let response
    if (isEdit.value) {
      response = await api.put(`/users/${props.user.id}`, payload)
      $q.notify({
        type: 'positive',
        message: 'Usuario actualizado exitosamente.',
        position: 'top-right',
        icon: 'check_circle',
        timeout: 3000,
      })
    } else {
      response = await api.post('/users', payload)
      $q.notify({
        type: 'positive',
        message: 'Usuario registrado exitosamente.',
        position: 'top-right',
        icon: 'person_add',
        timeout: 3000,
      })
    }

    emit('saved', response.data.data)
    emit('update:modelValue', false)
  } catch (error) {
    if (error.response?.data?.message) {
      serverError.value = error.response.data.message
    } else if (error.response?.data?.errors) {
      const firstKey = Object.keys(error.response.data.errors)[0]
      serverError.value = error.response.data.errors[firstKey][0]
    } else {
      serverError.value = 'Ocurrió un error al procesar el usuario. Inténtelo de nuevo.'
    }

    $q.notify({
      type: 'negative',
      message: serverError.value,
      position: 'top-right',
      icon: 'error',
      timeout: 4000,
    })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.user-dialog-card {
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  background-color: #ffffff;
}

.dialog-header {
  background: linear-gradient(135deg, #0d172a 0%, #1254e0 100%);
}

.border-radius-16 {
  border-radius: 16px;
}

.border-radius-8 {
  border-radius: 8px;
}

.border-soft {
  border: 1px solid #e2e8f0;
}

.border-negative {
  border-left: 4px solid #c10015;
}

.line-height-tight {
  line-height: 1.2;
}

.px-lg {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
