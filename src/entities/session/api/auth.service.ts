import { http } from '@/shared/api'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '../model/types'

export interface Authenticatable {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  getCurrentUser(): Promise<AuthUser>
  refresh(refreshToken: string): Promise<AuthTokens>
}

const EXPIRES_IN_MINS = Number(import.meta.env.VITE_TOKEN_EXPIRES_IN_MINS) || 60

export class AuthService implements Authenticatable {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: EXPIRES_IN_MINS }),
    })
  }

  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: EXPIRES_IN_MINS }),
    })
  }
}
