<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

const layouts = { default: DefaultLayout, auth: AuthLayout }

const route = useRoute()
const auth = useAuthStore()

// Layout обирається через meta.layout у маршруті
const layout = computed(() => layouts[route.meta.layout ?? 'default'])

// Перевіряємо збережену сесію запитом до захищеного ендпоїнта /auth/me.
// Якщо accessToken протермінований, interceptor оновить його через /auth/refresh.
onMounted(() => {
  if (auth.isAuthenticated) {
    auth.fetchCurrentUser().catch(() => undefined)
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
