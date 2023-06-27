export type User = {
  id: number
  username: string
  isDefault: boolean
  avatar: string
}

export type UserCreate = {
  id?: number
  username: string
  password: string
}