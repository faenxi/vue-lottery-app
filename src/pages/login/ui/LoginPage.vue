<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LoginForm } from '@/features/auth'

const route = useRoute()
const router = useRouter()

// Після логіну повертаємо на запитану сторінку (query-параметр redirect).
// Приймаємо лише внутрішні адреси, щоб уникнути редіректу на чужий сайт.
function getRedirectTarget(): string {
  const redirect = route.query.redirect
  const isInternal = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
  return isInternal ? redirect : '/users'
}

async function onLoggedIn(): Promise<void> {
  await router.replace(getRedirectTarget())
}
</script>

<template>
  <div>
    <h1 class="login__title">Login</h1>
    <p class="text-muted login__hint">Test account: <code>emilys</code> / <code>emilyspass</code></p>
    <LoginForm @success="onLoggedIn" />
  </div>
</template>

<style scoped lang="scss">
.login__title {
  font-size: 1.5rem;
}

.login__hint {
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}
</style>
