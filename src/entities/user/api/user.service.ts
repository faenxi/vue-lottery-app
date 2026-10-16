import { http } from '@/shared/api'
import type { Creatable, Deletable, Editable, ListParams, Paginated, Readable } from '@/shared/api'
import type { CreateUserDto, UpdateUserDto, User } from '../model/types'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export class UserService
  implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable<User>
{
  async getAll({ limit = 10, skip = 0, q = '' }: ListParams = {}): Promise<Paginated<User>> {
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    const search = q.trim()
    let path = '/users'
    if (search) {
      path = '/users/search'
      params.set('q', search)
    }

    const data = await http<UsersResponse>(`${path}?${params.toString()}`)
    return { items: data.users, total: data.total, skip: data.skip, limit: data.limit }
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }

  delete(id: number): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'DELETE' })
  }
}
