<script setup lang="ts">
import { computed, useId } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  type?: string
  placeholder?: string
  autocomplete?: string
}>()

const id = useId()

// Поле підключається до форми, створеної через useForm у батьківському компоненті
const { value, errorMessage, meta, handleBlur } = useField<string | number | undefined>(() => props.name)

// Помилку показуємо, коли поле «торкались» (blur) або форму відправляли
const showError = computed(() => meta.touched && Boolean(errorMessage.value))
const showSuccess = computed(() => meta.touched && meta.valid)
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold mb-1">{{ label }}</label>
    <input
      :id="id"
      v-model="value"
      :type="type ?? 'text'"
      class="form-control"
      :class="{ 'is-invalid': showError, 'is-valid': showSuccess }"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="showError"
      @blur="handleBlur"
    />
    <div v-if="showError" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>
