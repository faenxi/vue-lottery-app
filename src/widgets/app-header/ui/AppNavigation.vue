<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { BaseButton } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'

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

const auth = useAuthStore()
const router = useRouter()

function logout(): void {
  auth.logout()
  void router.push({ name: 'login' })
}
</script>

<template>
  <nav aria-label="Main navigation">
    <ul class="nav align-items-center">
      <li v-for="item in items" :key="item.label" class="nav-item">
        <RouterLink :to="item.to" class="nav-link" :active-class="item.exact ? '' : 'is-active'" exact-active-class="is-active">
          {{ item.label }}
        </RouterLink>
      </li>
      <li v-if="!auth.isAuthenticated" class="nav-item">
        <RouterLink :to="{ name: 'login' }" class="nav-link" active-class="is-active">Login</RouterLink>
      </li>
      <li v-else class="nav-item ms-2">
        <BaseButton variant="outline-primary" class="btn-sm" @click="logout">Logout</BaseButton>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.nav-link {
  color: var(--bs-body-color);
  border-bottom: 2px solid transparent;
  border-radius: 0;

  &:hover {
    color: var(--bs-primary);
  }

  // Активний пункт меню
  &.is-active {
    font-weight: 600;
    color: var(--bs-primary);
    border-bottom-color: var(--bs-primary);
  }
}
</style>
