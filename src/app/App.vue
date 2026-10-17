<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { useThemeStore } from '@/features/theme-switcher'
import { AppToast } from '@/shared/ui'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const layouts = { default: DefaultLayout, auth: AuthLayout }

const route = useRoute()
const session = useSessionStore()
// Створюємо стор теми одразу, щоб клас .app-dark застосувався і на сторінці логіну
useThemeStore()
const { isAuthenticated } = storeToRefs(session)

// Layout обирається через meta.layout у маршруті
const layout = computed(() => layouts[route.meta.layout ?? 'default'])

// Перевіряємо збережену сесію запитом до захищеного ендпоїнта /auth/me.
// Якщо accessToken протермінований, interceptor оновить його через /auth/refresh.
onMounted(() => {
  if (isAuthenticated.value) {
    session.fetchCurrentUser().catch(() => undefined)
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
  <AppToast />
</template>
