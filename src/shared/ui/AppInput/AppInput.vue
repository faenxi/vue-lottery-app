<script setup lang="ts">
import { computed, useId } from 'vue'
import InputText from 'primevue/inputtext'
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
const { value, errorMessage, meta, handleBlur } = useField<string | undefined>(() => props.name)

// Помилку показуємо, коли поле «торкались» (blur) або форму відправляли
const showError = computed(() => meta.touched && Boolean(errorMessage.value))
</script>

<template>
  <div class="app-input">
    <label :for="id" class="app-input__label">{{ label }}</label>
    <InputText
      :id="id"
      v-model="value"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :invalid="showError"
      :aria-invalid="showError"
      fluid
      @blur="handleBlur"
    />
    <small v-if="showError" class="app-input__error" role="alert">{{ errorMessage }}</small>
  </div>
</template>

<style scoped lang="scss">
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.app-input__label {
  font-weight: 600;
}

.app-input__error {
  color: var(--p-red-500);
}
</style>
