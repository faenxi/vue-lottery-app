<template>
  <div class="text-center py-5">
    <p class="display-1 fw-bold text-primary mb-0">404</p>
    <h1 class="h4 mb-3">Page not found</h1>
    <p class="text-body-secondary">The page you are looking for does not exist.</p>
    <RouterLink :to="{ name: 'home' }" class="btn btn-primary">Go to Home</RouterLink>
  </div>
</template>
