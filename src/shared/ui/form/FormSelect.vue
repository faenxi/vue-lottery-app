<script setup lang="ts">
import { computed, useId } from 'vue'
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
const showSuccess = computed(() => meta.touched && meta.valid)
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold mb-1">{{ label }}</label>
    <select
      :id="id"
      v-model="value"
      class="form-select"
      :class="{ 'is-invalid': showError, 'is-valid': showSuccess }"
      :aria-invalid="showError"
      @blur="handleBlur"
    >
      <option :value="undefined" disabled>{{ placeholder ?? 'Select...' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div v-if="showError" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>
