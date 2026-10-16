import type { Router } from 'vue-router'
import { setAuthHandlers } from '@/shared/api'
import { useSessionStore } from '@/entities/session'

/** Підключає http-клієнт до стору авторизації (токен, оновлення токена, вихід). */
export function setupAuth(router: Router): void {
  const session = useSessionStore()

  setAuthHandlers({
    getAccessToken: () => session.accessToken,
    refreshAccessToken: () => session.refreshAccessToken(),
    onAuthFailure: () => {
      session.clearSession()
      const route = router.currentRoute.value
      if (route.matched.some((record) => record.meta.requiresAuth)) {
        void router.push({ name: 'login', query: { redirect: route.fullPath } })
      }
    },
  })
}
