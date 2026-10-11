import { defineStore } from '#q-app'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/*
 * When adding new properties to stores, Pinia state or getters,
 * you can declare them in individual store files inside src/stores/
 */

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  return pinia
})
