export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Хуки авторизації. Їх реєструє застосунок (див. src/app/providers/auth.ts),
 * тому http-клієнт нічого не знає про Pinia чи роутер.
 */
export interface AuthHandlers {
  getAccessToken: () => string | null
  /** Повертає новий accessToken або null, якщо оновити не вдалося */
  refreshAccessToken: () => Promise<string | null>
  onAuthFailure: () => void
}

export interface HttpOptions extends RequestInit {
  /** Додати заголовок Authorization: Bearer і оновлювати токен при 401 */
  auth?: boolean
}

let authHandlers: AuthHandlers | null = null

export function setAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = handlers
}

function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) {
    throw new Error('VITE_API_URL is not set. Copy .env.example to .env')
  }
  return url.replace(/\/$/, '')
}

async function send(path: string, options: HttpOptions, isRetry: boolean): Promise<Response> {
  const { auth = false, headers: initHeaders, ...init } = options

  const headers = new Headers(initHeaders)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (auth) {
    const token = authHandlers?.getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${getBaseUrl()}${path}`, { ...init, headers })
  } catch {
    throw new HttpError(0, 'Network error. Check your connection and try again.')
  }

  // Interceptor: accessToken протермінований -> один раз оновлюємо токен і повторюємо запит
  if (response.status === 401 && auth && authHandlers) {
    if (!isRetry) {
      const newToken = await authHandlers.refreshAccessToken()
      if (newToken) return send(path, options, true)
    }
    authHandlers.onAuthFailure()
  }

  return response
}

async function toHttpError(response: Response): Promise<HttpError> {
  let message = `HTTP ${response.status}: ${response.statusText}`
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
      message = body.message
    }
  } catch {
    // тіло відповіді не є JSON, лишаємо стандартне повідомлення
  }
  return new HttpError(response.status, message)
}

/** Єдине місце, де відомо про fetch, базову адресу та обробку помилок. */
export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const response = await send(path, options, false)
  if (!response.ok) throw await toHttpError(response)
  return (await response.json()) as T
}
