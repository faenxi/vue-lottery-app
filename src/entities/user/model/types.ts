export type Gender = 'male' | 'female'

export interface UserAddress {
  address: string
  city: string
  state: string
  stateCode?: string
  postalCode: string
  country: string
  coordinates?: { lat: number; lng: number }
}

export interface UserCompany {
  name: string
  department: string
  title: string
}

/** Користувач за схемою DummyJSON (https://dummyjson.com/docs/users). */
export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: Gender
  email: string
  phone: string
  username: string
  password?: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: { color: string; type: string }
  ip?: string
  address?: UserAddress
  university?: string
  company?: UserCompany
  role?: 'admin' | 'moderator' | 'user'
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'
> & { password: string }

export type UpdateUserDto = Partial<CreateUserDto>
