<script setup lang="ts">
import { useForm } from 'vee-validate'
import BaseButton from '@/components/base/BaseButton.vue'
import FormInput from '@/components/form/FormInput.vue'
import FormSelect from '@/components/form/FormSelect.vue'
import type { SelectOption } from '@/types/form'
import { buildUserSchema, type UserFormValues } from '@/validation/schemas'

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
    <div class="row">
      <div class="col-md-6"><FormInput name="firstName" label="First name" placeholder="Enter first name" autocomplete="given-name" /></div>
      <div class="col-md-6"><FormInput name="lastName" label="Last name" placeholder="Enter last name" autocomplete="family-name" /></div>
      <div class="col-md-6"><FormInput name="email" label="Email" type="email" placeholder="Enter email" autocomplete="email" /></div>
      <div class="col-md-6"><FormInput name="username" label="Username" placeholder="Enter username" autocomplete="username" /></div>
      <div class="col-md-6">
        <FormInput
          name="password"
          label="Password"
          type="password"
          :placeholder="mode === 'edit' ? 'Leave empty to keep current' : 'At least 6 characters'"
          autocomplete="new-password"
        />
      </div>
      <div class="col-md-6"><FormInput name="phone" label="Phone number" type="tel" placeholder="+1 555-123-4567" autocomplete="tel" /></div>
      <div class="col-md-6"><FormInput name="age" label="Age" type="number" placeholder="Enter age" /></div>
      <div class="col-md-6"><FormSelect name="gender" label="Gender" :options="genderOptions" placeholder="Select gender" /></div>
    </div>

    <div v-if="serverError" class="alert alert-danger" role="alert">{{ serverError }}</div>

    <div class="d-flex justify-content-end gap-2 mt-2">
      <BaseButton variant="secondary" :disabled="isSubmitting" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" aria-hidden="true" />
        {{ mode === 'create' ? 'Save' : 'Update' }}
      </BaseButton>
    </div>
  </form>
</template>
