<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  href: string
  label: string
  icon?: string
}>()
</script>

<template>
  <Button as="a" :href="href" target="_blank" rel="noopener noreferrer" :label="label" :icon="icon" outlined />
</template>
