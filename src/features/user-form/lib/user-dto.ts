import type { CreateUserDto, UpdateUserDto } from '@/entities/user'
import type { UserFormValues } from '../model/schemas'

export function toCreateDto(values: UserFormValues): CreateUserDto {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    username: values.username,
    password: values.password ?? '',
    age: values.age,
    gender: values.gender,
    phone: values.phone,
  }
}

/** Порожній пароль при редагуванні означає «не змінювати», тому не надсилаємо його. */
export function toUpdateDto(values: UserFormValues): UpdateUserDto {
  const { password, ...rest } = values
  return password ? { ...rest, password } : rest
}
