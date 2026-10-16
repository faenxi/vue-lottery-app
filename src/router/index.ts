import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const APP_TITLE = 'Vue Lottery'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
  },
  {
    // Батьківський маршрут без компонента: лише спільний meta для /users та вкладених
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        path: ':id(\\d+)',
        name: 'user-details',
        component: () => import('@/views/UserDetailsView.vue'),
        props: true,
        meta: { title: 'User details' },
        children: [
          {
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'users' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
})

export default router
