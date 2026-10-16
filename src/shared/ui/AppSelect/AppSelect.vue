<script setup lang="ts">
import { computed, useId } from 'vue'
import Select from 'primevue/select'
import { useField } from 'vee-validate'
import type { SelectOption } from './types'

const props = defineProps<{
  name: string
  label: string
  options: SelectOption[]
  placeholder?: string
}>()

const id = useId()

const { value, errorMessage, meta, handleBlur } = useField<string | undefined>(() => props.name)

const showError = computed(() => meta.touched && Boolean(errorMessage.value))
</script>

<template>
  <div class="app-select">
    <label :for="id" class="app-select__label">{{ label }}</label>
    <Select
      v-model="value"
      :input-id="id"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder ?? 'Select...'"
      :invalid="showError"
      fluid
      @blur="handleBlur"
    />
    <small v-if="showError" class="app-select__error" role="alert">{{ errorMessage }}</small>
  </div>
</template>

<style scoped lang="scss">
.app-select {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.app-select__label {
  font-weight: 600;
}

.app-select__error {
  color: var(--p-red-500);
}
</style>
