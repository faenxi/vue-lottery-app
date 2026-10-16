<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { UserForm, toUpdateDto } from '@/features/user-form'
import type { UserFormValues } from '@/features/user-form'
import { getErrorMessage } from '@/shared/lib'
import { AppCard, useNotify } from '@/shared/ui'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  saved: [user: User]
  cancel: []
}>()

const { updateUser } = useUsersStore()
const notify = useNotify()

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
    const updated = await updateUser(props.user.id, toUpdateDto(values))
    notify.success('User has been updated.')
    emit('saved', updated)
  } catch (e) {
    serverError.value = getErrorMessage(e)
    notify.error(serverError.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppCard>
    <h2 class="user-edit__title">Edit user</h2>
    <UserForm
      mode="edit"
      :initial-values="initialValues"
      :is-submitting="isSubmitting"
      :server-error="serverError"
      @submit="onSubmit"
      @cancel="emit('cancel')"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.user-edit__title {
  margin-bottom: 1rem;
  font-size: 1.15rem;
}
</style>
