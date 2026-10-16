export interface ListParams {
  limit?: number
  skip?: number
  /** Пошуковий запит */
  q?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}
