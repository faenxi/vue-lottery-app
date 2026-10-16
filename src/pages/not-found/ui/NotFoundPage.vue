<template>
  <div class="not-found">
    <p class="not-found__code">404</p>
    <h1>Page not found</h1>
    <p class="text-muted">The page you are looking for does not exist.</p>
    <RouterLink :to="{ name: 'home' }">Go to Home</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  padding: 3rem 0;
  text-align: center;
}

.not-found__code {
  margin: 0;
  font-size: 5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--p-primary-color);
}
</style>
