import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { MIN_PASSWORD_LENGTH } from '@/shared/config'

const PHONE_REGEXP = /^\+?[\d\s()-]{7,20}$/

/**
 * Схема форми користувача (створення й редагування).
 * При редагуванні пароль необов'язковий: порожнє значення означає «не змінювати».
 */
export function buildUserObjectSchema(requirePassword: boolean) {
  return yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    email: yup.string().trim().required('Email is required').email('Enter a valid email'),
    username: yup.string().trim().required('Username is required').min(3, 'Username must be at least 3 characters'),
    password: yup
      .string()
      .test('password-required', 'Password is required', (value) => !requirePassword || Boolean(value))
      .test(
        'password-min',
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        (value) => !value || value.length >= MIN_PASSWORD_LENGTH,
      ),
    age: yup
      .number()
      .typeError('Age must be a number')
      .required('Age is required')
      .integer('Age must be a whole number')
      .min(1, 'Age must be at least 1')
      .max(120, 'Age must be at most 120'),
    gender: yup.string().oneOf(['male', 'female'] as const, 'Select gender').required('Select gender'),
    phone: yup.string().trim().required('Phone is required').matches(PHONE_REGEXP, 'Enter a valid phone number'),
  })
}

export type UserFormValues = yup.InferType<ReturnType<typeof buildUserObjectSchema>>

export function buildUserSchema(requirePassword: boolean) {
  return toTypedSchema(buildUserObjectSchema(requirePassword))
}
