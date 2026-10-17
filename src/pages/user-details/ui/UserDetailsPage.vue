<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { fullName, useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { useWinnersStore } from '@/features/lottery'
import { getErrorMessage } from '@/shared/lib'
import { AppButton, AppCard, AppMessage, AppSpinner } from '@/shared/ui'

// Параметр id передається в компонент через props: true у конфігурації маршруту
const props = defineProps<{
  id: string
}>()

const route = useRoute()
const router = useRouter()

const usersStore = useUsersStore()
const { listQuery } = storeToRefs(usersStore)
const { fetchUser } = usersStore
const { update: updateWinner } = useWinnersStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    user.value = await fetchUser(Number(props.id))
  } catch (e) {
    user.value = null
    error.value = getErrorMessage(e)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.id,
  () => {
    void loadUser()
  },
  { immediate: true },
)

const isEditing = computed(() => route.name === 'user-edit')

const fields = computed<{ label: string; value: string | number }[]>(() => {
  const u = user.value
  if (!u) return []
  const rows: { label: string; value: string | number | undefined }[] = [
    { label: 'Username', value: u.username },
    { label: 'Email', value: u.email },
    { label: 'Phone', value: u.phone },
    { label: 'Age', value: u.age },
    { label: 'Gender', value: u.gender },
    { label: 'Birth date', value: u.birthDate },
    { label: 'Role', value: u.role },
    { label: 'Company', value: u.company ? `${u.company.title}, ${u.company.name}` : undefined },
    { label: 'Address', value: u.address ? `${u.address.address}, ${u.address.city}, ${u.address.country}` : undefined },
    { label: 'University', value: u.university },
  ]
  return rows.filter((row): row is { label: string; value: string | number } => row.value !== undefined && row.value !== '')
})

function goToDetails(): void {
  void router.push({ name: 'user-details', params: { id: props.id } })
}

function goToEdit(): void {
  void router.push({ name: 'user-edit', params: { id: props.id } })
}

function onSaved(updated: User): void {
  user.value = updated
  updateWinner(updated)
  goToDetails()
}
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'users', query: listQuery }" class="user-details__back">
      <i class="pi pi-arrow-left" /> Back to users
    </RouterLink>

    <div v-if="isLoading" class="user-details__loading">
      <AppSpinner />
    </div>

    <div v-else-if="error" class="user-details__error">
      <AppMessage severity="error" class="user-details__error-text">{{ error }}</AppMessage>
      <AppButton label="Retry" variant="outline-danger" size="small" @click="loadUser" />
    </div>

    <template v-else-if="user">
      <AppCard class="user-details__card">
        <div class="user-details__head">
          <img v-if="user.image" :src="user.image" :alt="fullName(user)" width="72" height="72" class="user-details__avatar" />
          <i v-else class="pi pi-user user-details__avatar-icon" />
          <div class="user-details__title">
            <h1 class="user-details__name">{{ fullName(user) }}</h1>
            <span class="text-muted">#{{ user.id }}</span>
          </div>
          <AppButton v-if="!isEditing" label="Edit" variant="outline-primary" icon="pi pi-pencil" @click="goToEdit" />
        </div>

        <dl class="user-details__fields">
          <template v-for="field in fields" :key="field.label">
            <dt class="text-muted">{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </template>
        </dl>
      </AppCard>

      <!-- Вкладений маршрут /users/:id/edit рендериться тут -->
      <RouterView v-slot="{ Component }">
        <component :is="Component" v-if="Component" :user="user" @saved="onSaved" @cancel="goToDetails" />
      </RouterView>
    </template>
  </div>
</template>

<style scoped lang="scss">
.user-details__back {
  display: inline-block;
  margin-bottom: 1rem;
}

.user-details__loading {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.user-details__error {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.user-details__error-text {
  flex: 1 1 auto;
}

.user-details__card {
  margin-bottom: 1rem;
}

.user-details__head {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.user-details__avatar {
  object-fit: cover;
  background: var(--p-content-hover-background);
  border-radius: 50%;
}

.user-details__avatar-icon {
  font-size: 3rem;
  color: var(--p-text-muted-color);
}

.user-details__title {
  flex: 1 1 auto;
}

.user-details__name {
  margin: 0;
  font-size: 1.4rem;
}

.user-details__fields {
  display: grid;
  grid-template-columns: minmax(7rem, 12rem) 1fr;
  gap: 0.5rem 1rem;
  margin: 0;

  dd {
    margin: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;

    dd {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
