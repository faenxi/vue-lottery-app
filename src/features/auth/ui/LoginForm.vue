<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useSessionStore } from '@/entities/session'
import { getErrorMessage } from '@/shared/lib'
import { AppButton, AppInput, AppMessage, useNotify } from '@/shared/ui'
import { loginSchema } from '../model/schemas'

const emit = defineEmits<{
  success: []
}>()

const session = useSessionStore()
const notify = useNotify()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

// Валідація: VeeValidate + yup, поля підключаються через AppInput
const { handleSubmit } = useForm({ validationSchema: loginSchema })

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  submitError.value = null
  try {
    await session.login(values)
    notify.success('You are signed in.', 'Welcome')
    emit('success')
  } catch (e) {
    submitError.value = getErrorMessage(e)
    notify.error(submitError.value, 'Login failed')
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <AppInput name="username" label="Username" placeholder="Enter username" autocomplete="username" />
    <AppInput name="password" label="Password" type="password" placeholder="Enter password" autocomplete="current-password" />

    <AppMessage v-if="submitError" severity="error" class="login-form__error">{{ submitError }}</AppMessage>

    <AppButton type="submit" label="Login" :loading="isSubmitting" class="login-form__submit" />
  </form>
</template>

<style scoped lang="scss">
.login-form__error {
  margin-bottom: 1rem;
}

.login-form__submit {
  width: 100%;
}
</style>
