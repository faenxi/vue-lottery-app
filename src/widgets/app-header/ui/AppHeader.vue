<script setup lang="ts">
import { useSessionStore } from '@/entities/session'
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'

const session = useSessionStore()
</script>

<template>
  <header class="app-header bg-white border-bottom">
    <div class="container app-header__inner">
      <AppLogo />
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <span v-if="session.user" class="text-body-secondary small">Hi, {{ session.user.firstName }}</span>
        <AppNavigation />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
  justify-content: space-between;
  max-width: 1000px;
  padding-block: 0.75rem;
}
</style>
