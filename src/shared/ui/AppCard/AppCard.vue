<script setup lang="ts">
import Card from 'primevue/card'
</script>

<template>
  <Card class="app-card">
    <template #content>
      <slot />
    </template>
  </Card>
</template>
