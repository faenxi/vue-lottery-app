<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BaseButton, BaseModal, BasePagination } from '@/shared/ui'
import { WinnersBlock, useWinnersStore } from '@/features/lottery'
import { SearchBar } from '@/features/user-search'
import { UserForm, toCreateDto } from '@/features/user-form'
import { UsersTable } from '@/widgets/users-table'
import { PAGE_SIZE, useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { getErrorMessage } from '@/shared/lib'
import { fullName } from '@/entities/user'
import type { UserFormValues } from '@/features/user-form'

const route = useRoute()
const router = useRouter()
const users = useUsersStore()
const winners = useWinnersStore()

// Поточна сторінка та пошуковий запит живуть в URL: /users?page=2&q=john
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value >= 1 ? value : 1
})
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

function updateQuery({ page: nextPage = page.value, q = query.value }: { page?: number; q?: string }, replace = false) {
  const target = {
    query: {
      ...(nextPage > 1 ? { page: String(nextPage) } : {}),
      ...(q ? { q } : {}),
    },
  }
  return replace ? router.replace(target) : router.push(target)
}

const pageModel = computed({
  get: () => page.value,
  set: (value: number) => {
    void updateQuery({ page: value })
  },
})

async function loadUsers(): Promise<void> {
  await users.fetchUsers({ page: page.value, q: query.value })
  // Адреса вказує на неіснуючу сторінку (наприклад, ?page=999): переходимо на останню
  if (!users.error && page.value > users.pageCount) {
    await updateQuery({ page: users.pageCount }, true)
  }
}

watch(
  [page, query],
  () => {
    void loadUsers()
  },
  { immediate: true },
)

function onFilterByName(value: string): void {
  if (value === query.value) return
  // Новий пошук завжди починається з першої сторінки
  void updateQuery({ page: 1, q: value }, true)
}

const offset = computed(() => (page.value - 1) * PAGE_SIZE)
const isDrawDisabled = computed(() => !winners.canDraw(users.users))

// Повідомлення про успішні дії
const notice = ref<string | null>(null)
let noticeTimer: ReturnType<typeof setTimeout> | undefined

function showNotice(message: string): void {
  notice.value = message
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    notice.value = null
  }, 4000)
}

onUnmounted(() => clearTimeout(noticeTimer))

// Створення користувача
const isCreateOpen = ref(false)
const isCreating = ref(false)
const createError = ref<string | null>(null)

function openCreate(): void {
  createError.value = null
  isCreateOpen.value = true
}

async function createUser(values: UserFormValues): Promise<void> {
  isCreating.value = true
  createError.value = null
  try {
    const user = await users.createUser(toCreateDto(values))
    isCreateOpen.value = false
    showNotice(`User "${fullName(user)}" has been created.`)
    // Нові користувачі показуються на першій сторінці без пошукового фільтра
    if (page.value !== 1 || query.value) await updateQuery({ page: 1, q: '' })
  } catch (e) {
    createError.value = getErrorMessage(e)
  } finally {
    isCreating.value = false
  }
}

// Видалення користувача (із підтвердженням)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)
const userToDelete = ref<User | null>(null)

function askDelete(user: User): void {
  userToDelete.value = user
  deleteError.value = null
  isDeleteOpen.value = true
}

async function confirmDelete(): Promise<void> {
  const user = userToDelete.value
  if (!user) return
  isDeleting.value = true
  deleteError.value = null
  try {
    await users.removeUser(user.id)
    // Видалений користувач зникає і з блоку переможців
    winners.remove(user.id)
    isDeleteOpen.value = false
    showNotice(`User "${fullName(user)}" has been deleted.`)
    // Якщо на поточній сторінці нікого не лишилось, повертаємось на попередню
    if (users.users.length === 0 && page.value > 1) await updateQuery({ page: page.value - 1 })
  } catch (e) {
    deleteError.value = getErrorMessage(e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <WinnersBlock
      :winners="winners.winners"
      :is-draw-disabled="isDrawDisabled"
      @draw="winners.draw(users.users)"
      @remove-winner="winners.remove"
    />

    <section class="card">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-3 mb-3">
          <SearchBar class="flex-grow-1" :model-value="query" @filter-by-name="onFilterByName" />
          <BaseButton @click="openCreate">Add user</BaseButton>
        </div>

        <div v-if="notice" class="alert alert-success alert-dismissible" role="status">
          {{ notice }}
          <button type="button" class="btn-close" aria-label="Close" @click="notice = null" />
        </div>

        <div v-if="users.error" class="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
          <span>{{ users.error }}</span>
          <BaseButton variant="outline-danger" class="btn-sm" @click="loadUsers">Retry</BaseButton>
        </div>

        <div v-else-if="users.isLoading && users.users.length === 0" class="text-center py-5">
          <span class="spinner-border text-primary" role="status" aria-label="Loading" />
        </div>

        <template v-else>
          <div :class="{ 'is-loading': users.isLoading }">
            <UsersTable :users="users.users" :offset="offset" @delete="askDelete" />
            <p v-if="users.users.length === 0" class="text-center text-body-secondary mt-3 mb-0">No users found.</p>
          </div>
          <div class="mt-3">
            <BasePagination v-model:page="pageModel" :page-count="users.pageCount" />
          </div>
        </template>
      </div>
    </section>

    <BaseModal v-model="isCreateOpen" title="Add user">
      <UserForm :is-submitting="isCreating" :server-error="createError" @submit="createUser" @cancel="isCreateOpen = false" />
    </BaseModal>

    <BaseModal v-model="isDeleteOpen">
      <template #header>Видалити учасника</template>
      <p v-if="userToDelete" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ fullName(userToDelete) }}", "{{ userToDelete.email }}"?
      </p>
      <div v-if="deleteError" class="alert alert-danger mt-3 mb-0" role="alert">{{ deleteError }}</div>
      <template #footer>
        <BaseButton variant="danger" :disabled="isDeleting" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" :disabled="isDeleting" @click="isDeleteOpen = false">Ні</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.is-loading {
  pointer-events: none;
  opacity: 0.5;
  transition: opacity 0.15s;
}
</style>
