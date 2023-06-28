export type User = {
  id: number
  username: string
  isDefault: boolean
  avatar: string
}

export type UserCreate = {
  username: string
  password: string
}

export type UserUpdate = {
  id?: number
  username: string
  password?: string
}
