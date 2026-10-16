import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { AuthService, AuthUser, LoginCredentials } from '@/entities/session'

const STORAGE_KEY = 'vue-lottery-auth'

const authService = () => ServiceProvider.get<AuthService>('auth')

interface PersistedSession {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
}

function loadSession(): PersistedSession {
  const empty: PersistedSession = { accessToken: null, refreshToken: null, user: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<PersistedSession>
    if (typeof parsed.accessToken !== 'string') return empty
    return {
      accessToken: parsed.accessToken,
      refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null,
      user: parsed.user ?? null,
    }
  } catch {
    return empty
  }
}

function pickAuthUser(source: AuthUser): AuthUser {
  const { id, username, email, firstName, lastName, gender, image } = source
  return { id, username, email, firstName, lastName, gender, image }
}

export const useAuthStore = defineStore('auth', () => {
  // Відновлення сесії з localStorage при завантаженні застосунку
  const initial = loadSession()
  const accessToken = ref<string | null>(initial.accessToken)
  const refreshToken = ref<string | null>(initial.refreshToken)
  const user = ref<AuthUser | null>(initial.user)

  const isAuthenticated = computed(() => accessToken.value !== null)

  // Збереження сесії через watcher
  watch(
    [accessToken, refreshToken, user],
    () => {
      try {
        if (accessToken.value === null) {
          localStorage.removeItem(STORAGE_KEY)
          return
        }
        const session: PersistedSession = {
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
          user: user.value,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      } catch {
        // localStorage недоступний (приватний режим тощо), працюємо без збереження
      }
    },
    { deep: true },
  )

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await authService().login(credentials)
    accessToken.value = response.accessToken
    refreshToken.value = response.refreshToken
    user.value = pickAuthUser(response)
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  function logout(): void {
    clearSession()
  }

  async function fetchCurrentUser(): Promise<void> {
    const me = await authService().getCurrentUser()
    user.value = pickAuthUser(me)
  }

  // Якщо кілька запитів одночасно отримали 401, оновлюємо токен лише один раз
  let refreshPromise: Promise<string | null> | null = null

  function refreshAccessToken(): Promise<string | null> {
    const currentRefreshToken = refreshToken.value
    if (!currentRefreshToken) return Promise.resolve(null)

    refreshPromise ??= authService()
      .refresh(currentRefreshToken)
      .then((tokens) => {
        accessToken.value = tokens.accessToken
        refreshToken.value = tokens.refreshToken
        return tokens.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })

    return refreshPromise
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    clearSession,
    fetchCurrentUser,
    refreshAccessToken,
  }
})
