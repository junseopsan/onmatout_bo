import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'members',
          name: 'members',
          component: () => import('@/views/MemberView.vue')
        },
        {
          path: 'classes',
          name: 'classes',
          component: () => import('@/views/ClassView.vue')
        },
        {
          path: 'qr',
          name: 'qr',
          component: () => import('@/views/QRView.vue')
        },
        {
          path: 'members/:id',
          name: 'member-detail',
          component: () => import('@/views/MemberDetailView.vue')
        },
        {
          path: 'ticket-types',
          name: 'ticket-types',
          component: () => import('@/views/TicketTypeView.vue')
        },
        {
          path: 'attendance',
          name: 'attendance',
          component: () => import('@/views/AttendanceView.vue')
        },
        {
          path: 'qrcodes',
          name: 'qrcodes',
          component: () => import('@/views/QrCodeView.vue')
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/views/StatisticsView.vue')
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('@/views/AdminView.vue')
        }
      ]
    }
  ]
})

// 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const { supabase } = await import('@/services/supabase')
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    next('/login')
  } else if (to.path === '/login' && session) {
    next('/')
  } else {
    next()
  }
})

export default router 