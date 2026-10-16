// Дані для сторінок Home та About. Змініть на свої.
export const site = {
  title: 'Vue Lottery',
  repoUrl: 'https://github.com/faenxi/vue-lottery-app',
}

export const author = {
  // Додайте по батькові, якщо потрібен повний ПІБ
  fullName: 'Бикова Поліна',
  githubUrl: 'https://github.com/faenxi',
  skills: [
    { group: 'Frontend', items: ['HTML5', 'CSS3 / SCSS', 'JavaScript', 'TypeScript'] },
    { group: 'Vue ecosystem', items: ['Vue 3 (Composition API)', 'Vue Router', 'Pinia', 'VeeValidate + Yup'] },
    { group: 'UI та інструменти', items: ['Bootstrap 5', 'Vite', 'ESLint', 'Git / GitHub'] },
    { group: 'Web', items: ['REST API', 'JWT-авторизація'] },
  ],
}
