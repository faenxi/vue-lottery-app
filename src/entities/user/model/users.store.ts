import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { HttpError, ServiceProvider } from '@/shared/api'
import { getErrorMessage } from '@/shared/lib'
import type { UserService } from '../api/user.service'
import { fullName } from '../lib/full-name'
import type { CreateUserDto, UpdateUserDto, User } from './types'

export const PAGE_SIZE = 10

const userService = () => ServiceProvider.get<UserService>('users')

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  return q === '' || fullName(user).toLowerCase().includes(q)
}

/**
 * Стор користувачів.
 *
 * DummyJSON лише імітує POST / PUT / DELETE: сервер відповідає успішно, але дані не змінює.
 * Тому після успішної відповіді ми самі підтримуємо локальний стан:
 *  - createdUsers: щойно створені користувачі (показуються на першій сторінці);
 *  - editedUsers: оновлені користувачі (накладаються поверх відповіді сервера);
 *  - deletedUsers: видалені користувачі (приховуються зі списку).
 * Завдяки цьому зміни не зникають при переході між сторінками та пошуку.
 */
export const useUsersStore = defineStore('users', () => {
  const serverItems = ref<User[]>([])
  const serverTotal = ref(0)
  const currentPage = ref(1)
  const currentQuery = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const createdUsers = ref<User[]>([])
  const editedUsers = ref<Record<number, User>>({})
  const deletedUsers = ref<User[]>([])

  let lastRequestId = 0

  const matchingCreated = computed(() =>
    createdUsers.value.filter((user) => matchesQuery(user, currentQuery.value)),
  )

  /** Список користувачів поточної сторінки з урахуванням локальних змін. */
  const users = computed<User[]>(() => {
    const deletedIds = new Set(deletedUsers.value.map((user) => user.id))
    const fromServer = serverItems.value
      .filter((user) => !deletedIds.has(user.id))
      .map((user) => editedUsers.value[user.id] ?? user)
    return currentPage.value === 1 ? [...matchingCreated.value, ...fromServer] : fromServer
  })

  const total = computed(() => {
    const deletedMatching = deletedUsers.value.filter((user) => matchesQuery(user, currentQuery.value))
    return Math.max(0, serverTotal.value + matchingCreated.value.length - deletedMatching.length)
  })

  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

  /** Query-параметри списку, щоб після деталей повернутися на ту саму сторінку/пошук. */
  const listQuery = computed(() => ({
    ...(currentPage.value > 1 ? { page: String(currentPage.value) } : {}),
    ...(currentQuery.value ? { q: currentQuery.value } : {}),
  }))

  async function fetchUsers({ page, q }: { page: number; q: string }): Promise<void> {
    const requestId = ++lastRequestId
    isLoading.value = true
    error.value = null
    currentPage.value = page
    currentQuery.value = q

    try {
      const result = await userService().getAll({
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        q,
      })
      // Ігноруємо застарілі відповіді (користувач вже перейшов на іншу сторінку чи запит)
      if (requestId !== lastRequestId) return
      serverItems.value = result.items
      serverTotal.value = result.total
    } catch (e) {
      if (requestId === lastRequestId) error.value = getErrorMessage(e)
    } finally {
      if (requestId === lastRequestId) isLoading.value = false
    }
  }

  async function fetchUser(id: number): Promise<User> {
    const created = createdUsers.value.find((user) => user.id === id)
    if (created) return created
    if (deletedUsers.value.some((user) => user.id === id)) {
      throw new HttpError(404, 'This user has been deleted.')
    }
    const user = await userService().getById(id)
    return editedUsers.value[id] ?? user
  }

  async function createUser(dto: CreateUserDto): Promise<User> {
    const response = await userService().create(dto)
    // DummyJSON щоразу повертає той самий id, тому гарантуємо унікальність локально
    const usedIds = new Set(createdUsers.value.map((user) => user.id))
    let id = response.id
    while (usedIds.has(id)) id += 1

    const user: User = { ...dto, ...response, id }
    createdUsers.value = [user, ...createdUsers.value]
    return user
  }

  async function updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const existingCreated = createdUsers.value.find((user) => user.id === id)
    if (existingCreated) {
      // Користувача створено локально, на сервері його не існує: оновлюємо лише локально
      const updated: User = { ...existingCreated, ...dto }
      createdUsers.value = createdUsers.value.map((user) => (user.id === id ? updated : user))
      return updated
    }

    const response = await userService().update(id, dto)
    const base = editedUsers.value[id] ?? serverItems.value.find((user) => user.id === id)
    const updated: User = { ...base, ...response, id }
    editedUsers.value = { ...editedUsers.value, [id]: updated }
    return updated
  }

  async function removeUser(id: number): Promise<void> {
    const isLocal = createdUsers.value.some((user) => user.id === id)
    if (isLocal) {
      createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
      return
    }

    const deleted = await userService().delete(id)
    const user = serverItems.value.find((item) => item.id === id) ?? deleted
    deletedUsers.value = [...deletedUsers.value, user]
    const remainingEdits = { ...editedUsers.value }
    delete remainingEdits[id]
    editedUsers.value = remainingEdits
  }

  return {
    users,
    total,
    pageCount,
    currentPage,
    currentQuery,
    listQuery,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    removeUser,
  }
})
