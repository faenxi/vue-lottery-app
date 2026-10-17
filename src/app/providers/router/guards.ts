import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'

const APP_TITLE = 'Vue Lottery'

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const session = useSessionStore()

    if (to.matched.some((record) => record.meta.requiresAuth) && !session.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && session.isAuthenticated) {
      return { name: 'users' }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
  })
}
