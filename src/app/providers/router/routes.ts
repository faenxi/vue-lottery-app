import type { RouteRecordRaw } from 'vue-router'
import { AboutPage } from '@/pages/about'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'
import { UserDetailsPage, UserEditPage } from '@/pages/user-details'
import { UsersPage } from '@/pages/users'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
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
        component: UsersPage,
        meta: { title: 'Users' },
      },
      {
        path: ':id(\\d+)',
        name: 'user-details',
        component: UserDetailsPage,
        props: true,
        meta: { title: 'User details' },
        children: [
          {
            path: 'edit',
            name: 'user-edit',
            component: UserEditPage,
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: 'Page not found' },
  },
]
