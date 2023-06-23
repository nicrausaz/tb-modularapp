export type User = {
  id: number
  username: string
  isDefault: boolean
}

export type UserCreate = {
  id?: number
  username: string
  password: string
}