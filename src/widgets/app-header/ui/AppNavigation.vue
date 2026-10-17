<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { RouteLocationRaw } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'

interface NavItem {
  label: string
  to: RouteLocationRaw
  /** Активний лише при точному збігу (для Home, бо "/" є префіксом усіх адрес) */
  exact?: boolean
}

const items: NavItem[] = [
  { label: 'Home', to: { name: 'home' }, exact: true },
  { label: 'About author', to: { name: 'about' } },
  { label: 'Users', to: { name: 'users' } },
]

const { isAuthenticated } = storeToRefs(useSessionStore())
</script>

<template>
  <nav aria-label="Main navigation">
    <ul class="nav">
      <li v-for="item in items" :key="item.label">
        <RouterLink :to="item.to" class="nav__link" :active-class="item.exact ? '' : 'is-active'" exact-active-class="is-active">
          {{ item.label }}
        </RouterLink>
      </li>
      <li v-if="!isAuthenticated">
        <RouterLink :to="{ name: 'login' }" class="nav__link" active-class="is-active">Login</RouterLink>
      </li>
      <li v-else class="nav__action">
        <LogoutButton />
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
}

.nav__action {
  margin-left: 0.5rem;
}

.nav__link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--p-text-color);
  text-decoration: none;
  border-bottom: 2px solid transparent;

  &:hover {
    color: var(--p-primary-color);
    text-decoration: none;
  }

  // Активний пункт меню
  &.is-active {
    font-weight: 600;
    color: var(--p-primary-color);
    border-bottom-color: var(--p-primary-color);
  }
}
</style>
