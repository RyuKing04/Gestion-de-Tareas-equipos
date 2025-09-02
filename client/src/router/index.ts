import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import PublishingPlatformBoard from '../components/PublishingPlatformBoard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: PublishingPlatformBoard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.name === 'Login' && token) {
    next('/dashboard') // Redirect to dashboard if already logged in
  } else {
    next()
  }
})

export default router