import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LayoutAuthView from '@/views/auth/LayoutAuthView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/landing/LandingView.vue'
import LayoutView from '@/views/layout/LayoutView.vue'
import ChatBotView from '@/views/chat/ChatBotView.vue'
import DashBoardView from '@/views/landing/DashBoardView.vue'
import GastosDetailed from '@/views/landing/detailed/GastosDetailed.vue'
import GananciasDetailed from '@/views/landing/detailed/GananciasDetailed.vue'
import AddExpense from '@/components/AddExpense.vue'

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
    },
    {
      path: '/home',
      name: 'page',
      component: LayoutView,
      children:[
        {
          path: '/chatbot',
          name: 'chatbot',
          component: ChatBotView
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashBoardView
        },
        {
          path: '/gastos',
          name: 'gastos',
          component: GastosDetailed
        },
        {
          path: '/ganancias',
          name: 'ganancias',
          component: GananciasDetailed
        },
        {
          path: '/add-expense',
          name: 'add-expense',
          component: AddExpense
        }
      ]
    }
  
  ],
})

export default router
