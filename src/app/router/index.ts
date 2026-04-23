import { createRouter, createWebHistory } from 'vue-router'
import CockpitPage from '@/features/cockpit/components/CockpitPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'cockpit',
      component: CockpitPage
    }
  ]
})

export default router
