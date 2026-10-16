import { http } from '@/api/http-client'
import type { AuthTokens, LoginCredentials, LoginResponse } from '@/types/auth'
import type { User } from '@/types/user'
import type { Authenticatable } from './interfaces'

const EXPIRES_IN_MINS = Number(import.meta.env.VITE_TOKEN_EXPIRES_IN_MINS) || 60

export class AuthService implements Authenticatable {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: EXPIRES_IN_MINS }),
    })
  }

  getCurrentUser(): Promise<User> {
    return http<User>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: EXPIRES_IN_MINS }),
    })
  }
}
