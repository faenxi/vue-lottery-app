<script setup lang="ts">
defineProps<{
  name: string
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="winner-item">
    {{ name }}
    <button type="button" class="winner-item__remove" :aria-label="`Remove winner ${name}`" @click="emit('remove')">
      ×
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-item {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  padding: 0.15rem 0.45rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: var(--bs-primary);
  border-radius: 0.25rem;
}

.winner-item__remove {
  padding: 0;
  font-size: 0.8rem;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  background: none;
  border: 0;
}
</style>
