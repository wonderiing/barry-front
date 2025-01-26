import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LayoutAuthView from '@/views/auth/LayoutAuthView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/landing/LandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: LayoutAuthView,
      redirect: {name: 'login'},
      children: [
        {
          path: '/login',
          name: 'login',
          component: LoginView
        },
        {
          path: '/register',
          name: 'register',
          component: RegisterView
        }
      ],
    
    },
    {
      path: '/',
      name: 'home',
      component: LandingView
    }
  
  ],
})

export default router
