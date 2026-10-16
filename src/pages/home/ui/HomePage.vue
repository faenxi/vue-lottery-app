<script setup lang="ts">
import { AppCard, AppLinkButton } from '@/shared/ui'
import { site } from '@/shared/config'

const technologies = [
  'Vue 3 (Composition API, script setup) + TypeScript',
  'Feature-Sliced Design: шари app, pages, widgets, features, entities, shared',
  'Vue Router 4: маршрути, guards, layouts, lazy loading',
  'Pinia (setup stores): стани сесії, користувачів, переможців і теми',
  'VeeValidate + Yup: валідація форм',
  'PrimeVue (тема Aura) через обгортки в shared/ui + SCSS',
  'Патерн Repository: UserService, AuthService, ServiceProvider',
  'DummyJSON REST API, JWT (accessToken / refreshToken)',
  'Vite, ESLint (eslint-plugin-boundaries), gh-pages',
]
</script>

<template>
  <AppCard>
    <h1>{{ site.title }}</h1>
    <p>
      Навчальний застосунок-лотерея. Користувачі завантажуються з публічного API DummyJSON, їх можна шукати,
      переглядати по сторінках, створювати, редагувати та видаляти (сервер ці операції лише імітує, тому
      застосунок сам оновлює локальний стан). З учасників випадково обираються до трьох переможців.
    </p>
    <p>Розділ <strong>Users</strong> доступний лише після входу (логін <code>emilys</code>, пароль <code>emilyspass</code>).</p>

    <h2 class="home__subtitle">Технології</h2>
    <ul class="home__list">
      <li v-for="item in technologies" :key="item">{{ item }}</li>
    </ul>

    <AppLinkButton :href="site.repoUrl" label="Код проєкту на GitHub" icon="pi pi-github" />
  </AppCard>
</template>

<style scoped lang="scss">
.home__subtitle {
  margin-top: 1.5rem;
  font-size: 1.15rem;
}

.home__list {
  padding-left: 1.25rem;
  margin: 0 0 1.5rem;
}
</style>
