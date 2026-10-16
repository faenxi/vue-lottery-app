<script setup lang="ts">
import { BaseButton } from '@/shared/ui'
import type { User } from '@/types/user'
import { fullName } from '@/entities/user'

defineProps<{
  users: User[]
  /** Скільки записів пропущено (для наскрізної нумерації) */
  offset: number
}>()

const emit = defineEmits<{
  delete: [user: User]
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col" class="text-body-secondary">#</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col">Age</th>
          <th scope="col"><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <th scope="row" class="fw-normal text-body-secondary">{{ offset + index + 1 }}</th>
          <td>
            <RouterLink :to="{ name: 'user-details', params: { id: user.id } }" class="d-flex align-items-center gap-2 text-decoration-none">
              <img v-if="user.image" :src="user.image" :alt="fullName(user)" width="32" height="32" class="avatar" />
              <i v-else class="bi bi-person-circle fs-4 text-body-secondary" />
              {{ fullName(user) }}
            </RouterLink>
          </td>
          <td>{{ user.email }}</td>
          <td class="text-nowrap">{{ user.phone }}</td>
          <td>{{ user.age }}</td>
          <td class="text-nowrap text-end">
            <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }" class="btn btn-sm btn-outline-primary me-1">
              Edit
            </RouterLink>
            <BaseButton variant="outline-danger" class="btn-sm" @click="emit('delete', user)">Delete</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  object-fit: cover;
  background: #e9ecef;
  border-radius: 50%;
}
</style>
