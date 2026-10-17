<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

type Variant = 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-danger'

const {
  label,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  icon,
  size,
  text = false,
  rounded = false,
  ariaLabel,
} = defineProps<{
  label?: string
  variant?: Variant
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  /** Клас іконки (primeicons), наприклад "pi pi-moon" */
  icon?: string
  size?: 'small' | 'large'
  text?: boolean
  rounded?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const severity = computed<'secondary' | 'danger' | undefined>(() => {
  if (variant.includes('danger')) return 'danger'
  if (variant === 'secondary') return 'secondary'
  return undefined
})

const isOutlined = computed(() => variant.startsWith('outline'))
</script>

<template>
  <Button
    :label="label"
    :icon="icon"
    :severity="severity"
    :outlined="isOutlined"
    :text="text"
    :rounded="rounded"
    :size="size"
    :loading="loading"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  />
</template>
