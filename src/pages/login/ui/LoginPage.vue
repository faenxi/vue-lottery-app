<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { BaseButton, FormInput } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/shared/lib'
import { loginSchema } from '@/features/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

const { handleSubmit } = useForm({ validationSchema: loginSchema })

// Після логіну повертаємо на запитану сторінку (query-параметр redirect).
// Приймаємо лише внутрішні адреси, щоб уникнути редіректу на чужий сайт.
function getRedirectTarget(): string {
  const redirect = route.query.redirect
  const isInternal = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
  return isInternal ? redirect : '/users'
}

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  submitError.value = null
  try {
    await auth.login(values)
    await router.replace(getRedirectTarget())
  } catch (e) {
    submitError.value = getErrorMessage(e)
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <h1 class="h4 mb-1">Login</h1>
  <p class="text-body-secondary small mb-4">Test account: <code>emilys</code> / <code>emilyspass</code></p>

  <form novalidate @submit.prevent="onSubmit">
    <FormInput name="username" label="Username" placeholder="Enter username" autocomplete="username" />
    <FormInput name="password" label="Password" type="password" placeholder="Enter password" autocomplete="current-password" />

    <div v-if="submitError" class="alert alert-danger" role="alert">{{ submitError }}</div>

    <BaseButton type="submit" class="w-100" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" aria-hidden="true" />
      Login
    </BaseButton>
  </form>
</template>
