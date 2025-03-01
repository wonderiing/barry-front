import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LayoutAuthView from '@/views/auth/LayoutAuthView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/landing/LandingView.vue'
import LayoutView from '@/views/layout/LayoutView.vue'
import ChatBotView from '@/views/chat/ChatBotView.vue'
import DashBoardView from "@/views/landing/DashBoardView.vue"
import GastosDetailed from '@/views/landing/detailed/GastosDetailed.vue'
import GananciasDetailed from '@/views/landing/detailed/GananciasDetailed.vue'
import AddExpense from '@/components/AddExpense.vue'
import EditGasto from '@/views/landing/detailed/EditGasto.vue'
import AddIncomes from '@/components/AddIncomes.vue'
import EditGanancia from '@/views/landing/detailed/EditGanancia.vue'
import isAuthenticatedGuard from '@/guards/isAuth.guard'


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
        },

        
      ],
    
    },
    {
      path: '/',
      name: 'home',
      component: LandingView
    },
    {
      path: '/soporte',
      name: 'soporte',
      component: () => import('@/views/landing/SoporteView.vue')
    },
      {
        path: '/auth/success',
        name: 'auth-success',
        component: () => import("@/views/auth/AuthSuccess.vue"),
      },
    
    {
      path: '/home',
      name: 'page',
      beforeEnter: [isAuthenticatedGuard],
      component: LayoutView,
      children:[
        {
          path: '/chatbot',
          name: 'chatbot',
          component: () => import("@/views/chat/ChatBotView.vue")
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
          path: '/ingresos',
          name: 'ganancias',
          component: GananciasDetailed
        },
        {
          path: '/add-gasto',
          name: 'add-expense',
          component: AddExpense
        },

       { path: '/edit-gasto/:id',
        name: 'edit-gasto',
        props: (route) => {
          const id = Number(route.params.id)
          return isNaN(id) ? {id: 1} : {id}
        },
        component: EditGasto
      },
      {
        path: '/add-ingreso',
        name: 'add-ingreso',
        component: AddIncomes
      },
      { 
        path: '/edit-ingreso/:id',
        name: 'edit-ingreso',
        props: (route) => {
          const id = Number(route.params.id)
          return isNaN(id) ? {id: 1} : {id}
        },
        component: EditGanancia
      },
      {
        path: '/crypto',
        name: 'crypto',
        component: () => import("@/views/crypto/CryptoView.vue")
      },
      {
        path: '/reportes',
        name: 'pdf',
        component: () => import("@/views/landing/pdf/GeneratePdf.vue")
      }
      ]
    }
  
  ],
})

export default router
