import type { User } from './user'

/** Дані користувача, які зберігаємо після логіну. */
export type AuthUser = Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'gender'> & {
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
