import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('@/views/Goals.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/Calendar.vue')
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('@/views/Habits.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/Notes.vue')
    }
  ]
})

export default router
