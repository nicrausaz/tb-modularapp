export type UserEntity = {
  id: string
  username: string
  password: string
  isDefault: boolean
  avatar: string
}

export type User = {
  id?: string
  username: string
}
