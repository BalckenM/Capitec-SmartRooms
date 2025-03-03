import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const adminRoutes = {
  path: '/admin',
  component: () => import('../layouts/AdminLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      redirect: '/admin/dashboard'
    },
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: 'boardrooms',
      name: 'All Boardrooms',
      component: () => import('../views/boardrooms/BoardroomsList.vue')
    },
    {
      path: 'spaces',
      name: 'Spaces',
      component: () => import('../views/boardrooms/SpaceMaps.vue')
    },
    {
      path: 'room-types',
      name: 'Room Types',
      component: () => import('../views/boardrooms/RoomTypes.vue')
    },
    {
      path: 'facilities',
      name: 'Facilities',
      component: () => import('../views/boardrooms/Facilities.vue')
    },
    {
      path: 'maintenance',
      name: 'Maintenance',
      component: () => import('../views/boardrooms/Maintenance.vue')
    },
    {
      path: 'smart-devices',
      name: 'Smart Devices',
      component: () => import('../views/smart-controls/Devices.vue')
    },
    {
      path: 'automation',
      name: 'Automation',
      component: () => import('../views/smart-controls/Automation.vue')
    },
    {
      path: 'monitoring',
      name: 'Monitoring',
      component: () => import('../views/smart-controls/Monitoring.vue')
    },
    {
      path: 'alerts',
      name: 'Alerts',
      component: () => import('../views/smart-controls/Alerts.vue')
    },
    {
      path: 'clients',
      name: 'Clients',
      component: () => import('../views/clients/ClientsList.vue')
    },
    {
      path: 'organizations',
      name: 'Organizations',
      component: () => import('../views/clients/Organizations.vue')
    },
    {
      path: 'user-access',
      name: 'User Access',
      component: () => import('../views/clients/UserAccess.vue')
    },
    {
      path: 'access-logs',
      name: 'Access Logs',
      component: () => import('../views/clients/AccessLogs.vue')
    },
    {
      path: 'subscriptions',
      name: 'Active Plans',
      component: () => import('../views/subscriptions/ActivePlans.vue')
    },
    {
      path: 'subscription-plans',
      name: 'Plan Management',
      component: () => import('../views/subscriptions/PlanManagement.vue')
    },
    {
      path: 'usage-analytics',
      name: 'Usage Analytics',
      component: () => import('../views/analytics/UsageAnalytics.vue'),
      meta: { requiresPro: true }
    },
    {
      path: 'settings',
      children: [
        {
          path: 'general',
          name: 'General Settings',
          component: () => import('../views/settings/General.vue')
        },
        {
          path: 'security',
          name: 'Security Settings',
          component: () => import('../views/settings/Security.vue')
        },
        {
          path: 'integrations',
          name: 'Integrations',
          component: () => import('../views/settings/Integrations.vue')
        },
        {
          path: 'email-templates',
          name: 'Email Templates',
          component: () => import('../views/settings/EmailTemplates.vue')
        },
        {
          path: 'backup',
          name: 'Backup & Restore',
          component: () => import('../views/settings/Backup.vue')
        }
      ]
    },
    {
      path: 'scheduling',
      name: 'Room Scheduling',
      component: () => import('../views/SchedulingView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Room Scheduling'
      }
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  adminRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('Navigation to:', to.path)
  
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresPro = to.matched.some(record => record.meta.requiresPro)

  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('Auth required, redirecting to login')
    next('/login')
  } else if (requiresPro && !authStore.user?.isPro) {
    next('/admin/dashboard')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/admin/dashboard')
  } else {
    console.log('Proceeding with navigation')
    next()
  }
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router
