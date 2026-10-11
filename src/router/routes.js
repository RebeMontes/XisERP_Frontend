const routes = [
  // Rutas privadas del ERP: requieren autenticación activa
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue') },
      { path: 'clientes', name: 'clientes', component: () => import('@/pages/CustomersPage.vue') },
      { path: 'usuarios', name: 'usuarios', component: () => import('@/pages/UsersPage.vue') },
    ],
  },
  // Pantalla de login: solo accesible para invitados (sin sesión activa)
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },

  // Ruta comodín para capturar páginas no encontradas (404)
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
