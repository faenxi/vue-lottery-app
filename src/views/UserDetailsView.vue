<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useWinnersStore } from '@/stores/winners'
import type { User } from '@/types/user'
import { fullName, getErrorMessage } from '@/utils/error'

// Параметр id передається в компонент через props: true у конфігурації маршруту
const props = defineProps<{
  id: string
}>()

const route = useRoute()
const router = useRouter()
const users = useUsersStore()
const winners = useWinnersStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    user.value = await users.getUserById(Number(props.id))
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

function onSaved(updated: User): void {
  user.value = updated
  winners.update(updated)
  goToDetails()
}
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'users', query: users.listQuery }" class="d-inline-block mb-3 text-decoration-none">
      <i class="bi bi-arrow-left" /> Back to users
    </RouterLink>

    <div v-if="isLoading" class="text-center py-5">
      <span class="spinner-border text-primary" role="status" aria-label="Loading" />
    </div>

    <div v-else-if="error" class="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <span>{{ error }}</span>
      <button type="button" class="btn btn-sm btn-outline-danger" @click="loadUser">Retry</button>
    </div>

    <template v-else-if="user">
      <article class="card mb-3">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img v-if="user.image" :src="user.image" :alt="fullName(user)" width="72" height="72" class="avatar" />
            <i v-else class="bi bi-person-circle display-4 text-body-secondary" />
            <div class="flex-grow-1">
              <h1 class="h4 mb-0">{{ fullName(user) }}</h1>
              <span class="text-body-secondary">#{{ user.id }}</span>
            </div>
            <RouterLink v-if="!isEditing" :to="{ name: 'user-edit', params: { id } }" class="btn btn-outline-primary">
              Edit
            </RouterLink>
          </div>

          <dl class="row mb-0">
            <template v-for="field in fields" :key="field.label">
              <dt class="col-sm-3 text-body-secondary fw-normal">{{ field.label }}</dt>
              <dd class="col-sm-9">{{ field.value }}</dd>
            </template>
          </dl>
        </div>
      </article>

      <!-- Вкладений маршрут /users/:id/edit рендериться тут -->
      <RouterView v-slot="{ Component }">
        <component :is="Component" v-if="Component" :user="user" @saved="onSaved" @cancel="goToDetails" />
      </RouterView>
    </template>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  object-fit: cover;
  background: #e9ecef;
  border-radius: 50%;
}
</style>
