import type { ListParams, Paginated } from './types'

// Кожен інтерфейс описує одну можливість репозиторію,
// тому сервіс реалізує лише ті, які йому потрібні.
// Загальні (generic) контракти не залежать від бізнес-сутностей, тому живуть у shared.

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
