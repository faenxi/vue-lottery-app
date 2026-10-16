<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="container layout__main flex-grow-1">
      <slot />
    </main>
    <footer class="text-center text-body-secondary small py-3">Vue Lottery &middot; Lab 5</footer>
  </div>
</template>

<style scoped lang="scss">
.layout__main {
  max-width: 1000px;
  padding-block: 2rem;
}
</style>
