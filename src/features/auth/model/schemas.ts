import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { MIN_PASSWORD_LENGTH } from '@/shared/config'

export const loginSchema = toTypedSchema(
  yup.object({
    username: yup.string().trim().required('Username is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
  }),
)
