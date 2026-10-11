<template>
  <div class="menu-principal column full-height">
    <!-- Header / Branding con el Logo Oficial XIS -->
    <div class="logo-section q-pa-md row items-center no-wrap">
      <div class="logo-wrapper q-mr-sm shadow-4">
        <img src="@/assets/xis-logo.png" alt="XIS Logo" class="xis-logo-img" />
      </div>
      <div class="column">
        <div class="text-weight-bolder text-h6 text-white brand-title">
          ERP <span class="brand-highlight">XIS</span>
        </div>
        <div class="text-caption brand-subtitle">Servicios y Cómputo</div>
      </div>
    </div>

    <div class="menu-divider q-mx-md"></div>

    <!-- Navegación del Menú -->
    <q-scroll-area class="col q-py-md q-px-sm">
      <q-list class="q-gutter-y-xs">
        <q-item-label header class="menu-section-header q-px-sm q-pt-xs q-pb-sm">
          MÓDULOS PRINCIPALES
        </q-item-label>

        <!-- Inicio -->
        <q-item
          clickable
          v-ripple
          to="/"
          exact
          active-class="menu-item-active"
          class="menu-item border-radius-8"
        >
          <q-item-section avatar class="item-icon-section">
            <q-icon name="dashboard" size="22px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Inicio</q-item-label>
          </q-item-section>
          <q-item-section side class="active-indicator-side">
            <q-icon name="chevron_right" size="18px" class="active-arrow" />
          </q-item-section>
        </q-item>

        <!-- Clientes -->
        <q-item
          clickable
          v-ripple
          to="/clientes"
          active-class="menu-item-active"
          class="menu-item border-radius-8"
        >
          <q-item-section avatar class="item-icon-section">
            <q-icon name="people" size="22px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Clientes</q-item-label>
            <q-item-label caption class="item-caption">Padrón de clientes</q-item-label>
          </q-item-section>
          <q-item-section side class="active-indicator-side">
            <q-icon name="chevron_right" size="18px" class="active-arrow" />
          </q-item-section>
        </q-item>

        <!-- Usuarios -->
        <q-item
          clickable
          v-ripple
          to="/usuarios"
          active-class="menu-item-active"
          class="menu-item border-radius-8"
        >
          <q-item-section avatar class="item-icon-section">
            <q-icon name="manage_accounts" size="22px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Usuarios</q-item-label>
            <q-item-label caption class="item-caption">Cuentas y roles</q-item-label>
          </q-item-section>
          <q-item-section side class="active-indicator-side">
            <q-icon name="chevron_right" size="18px" class="active-arrow" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <div class="menu-divider q-mx-md"></div>

    <!-- Footer del Menú: Estado del Sistema -->
    <div class="q-pa-md system-footer row items-center justify-between">
      <div class="row items-center">
        <span class="status-indicator q-mr-xs"></span>
        <span class="text-caption text-weight-medium footer-text">Sistema Online</span>
      </div>
      <div class="footer-badge">v1.0.0</div>
    </div>
  </div>
</template>

<script setup>
// Componente de Menú Principal con alto contraste y diseño premium
</script>

<style scoped lang="scss">
.menu-principal {
  background-color: #0d172a; // Dark Slate Navy elegante y de alto contraste
  color: #e2e8f0;
}

.logo-section {
  background: linear-gradient(180deg, #13223f 0%, #0d172a 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-wrapper {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #5cb811; // Borde verde tecnológico del logo
  flex-shrink: 0;
}

.xis-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-title {
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.brand-highlight {
  color: #5cb811; // Verde lima del logo
  text-shadow: 0 0 10px rgba(92, 184, 17, 0.35);
}

.brand-subtitle {
  color: #94a3b8;
  font-size: 11px;
  letter-spacing: 0.3px;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.menu-section-header {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.border-radius-8 {
  border-radius: 8px;
}

.item-icon-section {
  min-width: 38px;
}

.menu-item {
  color: #94a3b8;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px 12px;
  margin-bottom: 3px;

  .item-caption {
    color: #64748b;
    font-size: 11px;
  }

  .active-arrow {
    opacity: 0;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;

    .item-caption {
      color: #94a3b8;
    }

    .q-icon {
      color: #38bdf8;
    }
  }
}

// Resaltado Intenso y Llamativo del Módulo Activo
.menu-item-active {
  background: linear-gradient(90deg, #1254e0 0%, #1e40af 100%) !important;
  color: #ffffff !important;
  font-weight: 600;
  border-left: 5px solid #5cb811 !important; // Verde lima brillante del logo
  box-shadow: 0 4px 14px rgba(18, 84, 224, 0.5) !important;

  .q-icon {
    color: #ffffff !important;
  }

  .item-caption {
    color: #bfdbfe !important; // Azul hielo muy legible
  }

  .active-arrow {
    opacity: 1 !important;
    color: #5cb811 !important;
    transform: translateX(2px);
  }
}

.active-indicator-side {
  padding-left: 0;
}

.status-indicator {
  width: 9px;
  height: 9px;
  background-color: #5cb811;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px rgba(92, 184, 17, 0.8);
}

.system-footer {
  background-color: #0b1322;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-text {
  color: #94a3b8;
}

.footer-badge {
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(18, 84, 224, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.3);
}
</style>
