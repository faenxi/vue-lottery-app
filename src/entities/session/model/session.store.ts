import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

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

/**
 * Стор сесії: токени, поточний користувач, ознака авторизації.
 *
 * Збереження в localStorage реалізоване вручну (loadSession / persist), щоб було що порівняти
 * з pinia-plugin-persistedstate (див. README, розділ «Збереження стану Pinia»).
 */
export const useSessionStore = defineStore('session', () => {
  // Відновлення сесії з localStorage при створенні стору
  const initial = loadSession()
  const accessToken = ref<string | null>(initial.accessToken)
  const refreshToken = ref<string | null>(initial.refreshToken)
  const user = ref<AuthUser | null>(initial.user)

  const isAuthenticated = computed(() => accessToken.value !== null)

  function persist(): void {
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
  }

  /** Зберігає токени (і, за потреби, користувача) у сторі та localStorage. */
  function setSession(tokens: AuthTokens, nextUser?: AuthUser): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    if (nextUser) user.value = pickAuthUser(nextUser)
    persist()
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    persist()
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const { accessToken: access, refreshToken: refresh, ...profile } = await authService().login(credentials)
    setSession({ accessToken: access, refreshToken: refresh }, profile)
  }

  function logout(): void {
    clearSession()
  }

  async function fetchCurrentUser(): Promise<void> {
    user.value = pickAuthUser(await authService().getCurrentUser())
    persist()
  }

  // Якщо кілька запитів одночасно отримали 401, оновлюємо токен лише один раз
  let refreshPromise: Promise<string | null> | null = null

  function refreshAccessToken(): Promise<string | null> {
    const currentRefreshToken = refreshToken.value
    if (!currentRefreshToken) return Promise.resolve(null)

    refreshPromise ??= authService()
      .refresh(currentRefreshToken)
      .then((tokens) => {
        setSession(tokens)
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
    setSession,
    clearSession,
    login,
    logout,
    fetchCurrentUser,
    refreshAccessToken,
  }
})
