<script setup lang="ts">
import Message from 'primevue/message'

const { severity = 'info' } = defineProps<{
  severity?: 'success' | 'info' | 'warn' | 'error'
}>()
</script>

<template>
  <Message :severity="severity" role="alert">
    <slot />
  </Message>
</template>
