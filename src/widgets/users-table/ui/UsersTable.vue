<script setup lang="ts">
import { useRouter } from 'vue-router'
import { fullName } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppButton, AppTable } from '@/shared/ui'
import type { AppTableColumn } from '@/shared/ui'

defineProps<{
  users: User[]
  /** Скільки записів пропущено (для наскрізної нумерації) */
  offset: number
}>()

const emit = defineEmits<{
  delete: [user: User]
}>()

const router = useRouter()

const columns: AppTableColumn[] = [
  { key: 'index', header: '#' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email', field: 'email' },
  { key: 'phone', header: 'Phone number', field: 'phone', nowrap: true },
  { key: 'age', header: 'Age', field: 'age' },
  { key: 'actions', header: '', align: 'right', nowrap: true },
]

function goToEdit(user: User): void {
  void router.push({ name: 'user-edit', params: { id: user.id } })
}
</script>

<template>
  <AppTable :rows="users" :columns="columns" data-key="id">
    <template #cell-index="{ index }">
      <span class="text-muted">{{ offset + index + 1 }}</span>
    </template>

    <template #cell-name="{ row }">
      <RouterLink :to="{ name: 'user-details', params: { id: row.id } }" class="users-table__name">
        <img v-if="row.image" :src="row.image" :alt="fullName(row)" width="32" height="32" class="users-table__avatar" />
        <i v-else class="pi pi-user users-table__avatar-icon" />
        {{ fullName(row) }}
      </RouterLink>
    </template>

    <template #cell-actions="{ row }">
      <div class="users-table__actions">
        <AppButton label="Edit" variant="outline-primary" size="small" @click="goToEdit(row)" />
        <AppButton label="Delete" variant="outline-danger" size="small" @click="emit('delete', row)" />
      </div>
    </template>

    <template #empty>No users found.</template>
  </AppTable>
</template>

<style scoped lang="scss">
.users-table__name {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.users-table__avatar {
  object-fit: cover;
  background: var(--p-content-hover-background);
  border-radius: 50%;
}

.users-table__avatar-icon {
  font-size: 1.5rem;
  color: var(--p-text-muted-color);
}

.users-table__actions {
  display: inline-flex;
  gap: 0.5rem;
}
</style>
