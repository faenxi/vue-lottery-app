<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/entities/session'
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'

const { user } = storeToRefs(useSessionStore())
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <div class="app-header__right">
        <span v-if="user" class="app-header__hello">Hi, {{ user.firstName }}</span>
        <AppNavigation />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--p-content-border-color);
}

.app-header__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
  justify-content: space-between;
  max-width: 1000px;
  padding: 0.75rem 1rem;
  margin-inline: auto;
}

.app-header__right {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.app-header__hello {
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
}
</style>
