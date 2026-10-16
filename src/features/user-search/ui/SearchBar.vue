<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppSearchInput } from '@/shared/ui'

const DEBOUNCE_MS = 300

const props = withDefaults(
  defineProps<{
    /** Початкове значення (наприклад, із query-параметра q) */
    modelValue?: string
  }>(),
  { modelValue: '' },
)

const emit = defineEmits<{
  'filter-by-name': [query: string]
}>()

const query = ref(props.modelValue)
let lastEmitted = props.modelValue.trim()

// Зовнішня зміна (кнопки «назад/вперед» у браузері) оновлює поле пошуку
watch(
  () => props.modelValue,
  (value) => {
    if (value !== lastEmitted) {
      lastEmitted = value
      query.value = value
    }
  },
)

// Debounce 300 мс: попередній таймер скасовується при кожній новій зміні
watch(query, (value, _oldValue, onCleanup) => {
  const timerId = setTimeout(() => {
    lastEmitted = value.trim()
    emit('filter-by-name', lastEmitted)
  }, DEBOUNCE_MS)
  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <AppSearchInput v-model="query" placeholder="Search by name" aria-label="Search by name" />
</template>
