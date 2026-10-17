<script setup lang="ts">
import Dialog from 'primevue/dialog'

defineProps<{
  title?: string
  width?: string
}>()

const isOpen = defineModel<boolean>({ required: true })
</script>

<template>
  <Dialog v-model:visible="isOpen" modal :header="title" :style="{ width: width ?? '40rem', maxWidth: '95vw' }">
    <slot />
  </Dialog>
</template>
