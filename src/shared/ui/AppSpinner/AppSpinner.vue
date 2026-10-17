<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
</script>

<template>
  <ProgressSpinner stroke-width="4" aria-label="Loading" class="app-spinner" />
</template>

<style scoped lang="scss">
.app-spinner {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
