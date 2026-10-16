import type { AuthTokens, LoginCredentials, LoginResponse } from '@/types/auth'
import type { User } from '@/types/user'
import type { ListParams, Paginated } from '@/types/pagination'

// Кожен інтерфейс описує одну можливість репозиторію,
// тому сервіс реалізує лише ті, які йому потрібні.

export interface Readable<T> {
  getAll(params?: ListParams): Promise<Paginated<T>>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate = Partial<T>> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate = Partial<T>> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<T> {
  delete(id: number): Promise<T>
}

export interface Authenticatable {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  getCurrentUser(): Promise<User>
  refresh(refreshToken: string): Promise<AuthTokens>
}
