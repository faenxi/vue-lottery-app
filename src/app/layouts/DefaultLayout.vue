<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <footer class="layout__footer">Vue Lottery &middot; Lab 6</footer>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex-grow: 1;
  width: 100%;
  max-width: 1000px;
  padding: 2rem 1rem;
  margin-inline: auto;
}

.layout__footer {
  padding: 1rem;
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
  text-align: center;
}
</style>
