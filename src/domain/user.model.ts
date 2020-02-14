export const enum UserType {
  USER = 0,
  MODERATOR = 1,
  ADMINISTRATOR = 2,
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  type: UserType
  active: boolean | null
  activatedBy: string | null
  activatedAt: Date | null
  deactivatedBy: string | null
  deactivatedAt: Date | null
}
