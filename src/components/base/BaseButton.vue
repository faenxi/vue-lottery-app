<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-danger'

const { variant = 'primary', type = 'button' } = defineProps<{
  variant?: Variant
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button class="btn" :class="`btn-${variant}`" :type="type">
    <slot />
  </button>
</template>
