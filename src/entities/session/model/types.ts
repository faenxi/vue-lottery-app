/** Дані користувача, які зберігаємо після логіну (slice session не залежить від slice user). */
export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  username: string
  password: string
}

/** Відповідь POST /auth/login */
export type LoginResponse = AuthUser & AuthTokens
