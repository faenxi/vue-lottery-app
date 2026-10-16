<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { PAGE_SIZE, fullName, useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { UserForm, toCreateDto } from '@/features/user-form'
import type { UserFormValues } from '@/features/user-form'
import { WinnersBlock, useWinnersStore } from '@/features/lottery'
import { SearchBar } from '@/features/user-search'
import { getErrorMessage } from '@/shared/lib'
import {
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppMessage,
  AppModal,
  AppPagination,
  AppSpinner,
  useNotify,
} from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'

const route = useRoute()
const router = useRouter()
const notify = useNotify()

// Сторінка працює зі сторами, а не з сервісами напряму
const usersStore = useUsersStore()
const { users, total, pageCount, isLoading, error } = storeToRefs(usersStore)
const { fetchUsers, createUser, removeUser } = usersStore

const winnersStore = useWinnersStore()
const { winners } = storeToRefs(winnersStore)
const { canDraw, draw, remove: removeWinner } = winnersStore

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
  await fetchUsers({ page: page.value, q: query.value })
  // Адреса вказує на неіснуючу сторінку (наприклад, ?page=999): переходимо на останню
  if (!error.value && page.value > pageCount.value) {
    await updateQuery({ page: pageCount.value }, true)
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
const isDrawDisabled = computed(() => !canDraw(users.value))

// Створення користувача
const isCreateOpen = ref(false)
const isCreating = ref(false)
const createError = ref<string | null>(null)

function openCreate(): void {
  createError.value = null
  isCreateOpen.value = true
}

async function onCreate(values: UserFormValues): Promise<void> {
  isCreating.value = true
  createError.value = null
  try {
    const user = await createUser(toCreateDto(values))
    isCreateOpen.value = false
    notify.success(`User "${fullName(user)}" has been created.`)
    // Нові користувачі показуються на першій сторінці без пошукового фільтра
    if (page.value !== 1 || query.value) await updateQuery({ page: 1, q: '' })
  } catch (e) {
    createError.value = getErrorMessage(e)
    notify.error(createError.value)
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
    await removeUser(user.id)
    // Видалений користувач зникає і з блоку переможців
    removeWinner(user.id)
    isDeleteOpen.value = false
    notify.success(`User "${fullName(user)}" has been deleted.`)
    // Якщо на поточній сторінці нікого не лишилось, повертаємось на попередню
    if (users.value.length === 0 && page.value > 1) await updateQuery({ page: page.value - 1 })
  } catch (e) {
    deleteError.value = getErrorMessage(e)
    notify.error(deleteError.value)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <WinnersBlock
      class="users-page__winners"
      :winners="winners"
      :is-draw-disabled="isDrawDisabled"
      @draw="draw(users)"
      @remove-winner="removeWinner"
    />

    <AppCard>
      <div class="users-page__toolbar">
        <SearchBar class="users-page__search" :model-value="query" @filter-by-name="onFilterByName" />
        <AppButton label="Add user" icon="pi pi-plus" @click="openCreate" />
      </div>

      <div v-if="error" class="users-page__error">
        <AppMessage severity="error" class="users-page__error-text">{{ error }}</AppMessage>
        <AppButton label="Retry" variant="outline-danger" size="small" @click="loadUsers" />
      </div>

      <div v-else-if="isLoading && users.length === 0" class="users-page__loading">
        <AppSpinner />
      </div>

      <template v-else>
        <div :class="{ 'is-loading': isLoading }">
          <UsersTable :users="users" :offset="offset" @delete="askDelete" />
        </div>
        <AppPagination v-model:page="pageModel" :total="total" :page-size="PAGE_SIZE" />
      </template>
    </AppCard>

    <AppModal v-model="isCreateOpen" title="Add user">
      <UserForm :is-submitting="isCreating" :server-error="createError" @submit="onCreate" @cancel="isCreateOpen = false" />
    </AppModal>

    <AppConfirmDialog
      v-model="isDeleteOpen"
      title="Видалити учасника"
      :loading="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
    >
      <p v-if="userToDelete" class="users-page__confirm-text">
        Ви дійсно бажаєте видалити учасника "{{ fullName(userToDelete) }}", "{{ userToDelete.email }}"?
      </p>
    </AppConfirmDialog>
  </div>
</template>

<style scoped lang="scss">
.users-page__winners {
  margin-bottom: 1rem;
}

.users-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.users-page__search {
  flex: 1 1 14rem;
}

.users-page__error {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.users-page__error-text {
  flex: 1 1 auto;
}

.users-page__loading {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.users-page__confirm-text {
  margin: 0;
}

.is-loading {
  pointer-events: none;
  opacity: 0.5;
  transition: opacity 0.15s;
}
</style>
