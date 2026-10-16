export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function fullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`
}
