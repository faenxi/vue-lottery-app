import type { Router } from 'vue-router'
import { setAuthHandlers } from '@/api/http-client'
import { useAuthStore } from '@/stores/auth'

/** Підключає http-клієнт до стору авторизації (токен, оновлення токена, вихід). */
export function setupAuth(router: Router): void {
  const auth = useAuthStore()

  setAuthHandlers({
    getAccessToken: () => auth.accessToken,
    refreshAccessToken: () => auth.refreshAccessToken(),
    onAuthFailure: () => {
      auth.clearSession()
      const route = router.currentRoute.value
      if (route.matched.some((record) => record.meta.requiresAuth)) {
        void router.push({ name: 'login', query: { redirect: route.fullPath } })
      }
    },
  })
}
