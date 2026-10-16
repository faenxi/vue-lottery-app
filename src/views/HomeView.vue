<script setup lang="ts">
import { site } from '@/config/site'

const technologies = [
  'Vue 3 (Composition API, script setup)',
  'TypeScript',
  'Vue Router 4: маршрути, guards, layouts, lazy loading',
  'Pinia: стани авторизації, користувачів і переможців',
  'VeeValidate + Yup: валідація форм',
  'Bootstrap 5 + SCSS (лише потрібні модулі)',
  'Патерн Repository: UserService, AuthService, ServiceProvider',
  'DummyJSON REST API, JWT (accessToken / refreshToken)',
  'Vite, ESLint, gh-pages',
]
</script>

<template>
  <article class="card">
    <div class="card-body p-4">
      <h1 class="h3 mb-3">{{ site.title }}</h1>
      <p>
        Навчальний застосунок-лотерея. Користувачі завантажуються з публічного API DummyJSON, їх можна шукати,
        переглядати по сторінках, створювати, редагувати та видаляти (сервер ці операції лише імітує, тому
        застосунок сам оновлює локальний стан). З учасників випадково обираються до трьох переможців.
      </p>
      <p>Розділ <strong>Users</strong> доступний лише після входу (логін <code>emilys</code>, пароль <code>emilyspass</code>).</p>

      <h2 class="h5 mt-4">Технології</h2>
      <ul>
        <li v-for="item in technologies" :key="item">{{ item }}</li>
      </ul>

      <a :href="site.repoUrl" class="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
        <i class="bi bi-github me-1" /> Код проєкту на GitHub
      </a>
    </div>
  </article>
</template>
