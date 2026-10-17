<script setup lang="ts">
import { useForm } from 'vee-validate'
import { AppButton, AppInput, AppMessage, AppSelect } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import { buildUserSchema } from '../model/schemas'
import type { UserFormValues } from '../model/schemas'

const {
  mode = 'create',
  initialValues,
  isSubmitting = false,
  serverError = null,
} = defineProps<{
  mode?: 'create' | 'edit'
  initialValues?: Partial<UserFormValues>
  isSubmitting?: boolean
  serverError?: string | null
}>()

const emit = defineEmits<{
  submit: [values: UserFormValues]
  cancel: []
}>()

const genderOptions: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

// Валідація: VeeValidate + yup (обов'язкові поля, формат email, мінімальна довжина пароля)
const { handleSubmit } = useForm({
  validationSchema: buildUserSchema(mode === 'create'),
  initialValues,
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="user-form__grid">
      <AppInput name="firstName" label="First name" placeholder="Enter first name" autocomplete="given-name" />
      <AppInput name="lastName" label="Last name" placeholder="Enter last name" autocomplete="family-name" />
      <AppInput name="email" label="Email" type="email" placeholder="Enter email" autocomplete="email" />
      <AppInput name="username" label="Username" placeholder="Enter username" autocomplete="username" />
      <AppInput
        name="password"
        label="Password"
        type="password"
        :placeholder="mode === 'edit' ? 'Leave empty to keep current' : 'At least 6 characters'"
        autocomplete="new-password"
      />
      <AppInput name="phone" label="Phone number" type="tel" placeholder="+1 555-123-4567" autocomplete="tel" />
      <AppInput name="age" label="Age" type="number" placeholder="Enter age" />
      <AppSelect name="gender" label="Gender" :options="genderOptions" placeholder="Select gender" />
    </div>

    <AppMessage v-if="serverError" severity="error" class="user-form__error">{{ serverError }}</AppMessage>

    <div class="user-form__actions">
      <AppButton label="Cancel" variant="secondary" :disabled="isSubmitting" @click="emit('cancel')" />
      <AppButton type="submit" :label="mode === 'create' ? 'Save' : 'Update'" :loading="isSubmitting" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.user-form__error {
  margin-bottom: 1rem;
}

.user-form__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
