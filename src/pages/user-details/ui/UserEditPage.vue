<script setup lang="ts">
import { ref } from 'vue'
import { UserForm, toUpdateDto } from '@/features/user-form'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'
import { getErrorMessage } from '@/shared/lib'
import type { UserFormValues } from '@/features/user-form'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  saved: [user: User]
  cancel: []
}>()

const users = useUsersStore()

const isSubmitting = ref(false)
const serverError = ref<string | null>(null)

// Пароль не підставляємо: порожнє поле означає «не змінювати»
const initialValues: Partial<UserFormValues> = {
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
  username: props.user.username,
  age: props.user.age,
  gender: props.user.gender,
  phone: props.user.phone,
}

async function onSubmit(values: UserFormValues): Promise<void> {
  isSubmitting.value = true
  serverError.value = null
  try {
    const updated = await users.update(props.user.id, toUpdateDto(values))
    emit('saved', updated)
  } catch (e) {
    serverError.value = getErrorMessage(e)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <h2 class="h5 mb-3">Edit user</h2>
      <UserForm
        mode="edit"
        :initial-values="initialValues"
        :is-submitting="isSubmitting"
        :server-error="serverError"
        @submit="onSubmit"
        @cancel="emit('cancel')"
      />
    </div>
  </section>
</template>
