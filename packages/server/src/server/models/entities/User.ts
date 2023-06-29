export type UserEntity = {
  id: number
  username: string
  password: string
  isDefault: boolean
  avatar: string
}

export type ReqUser = {
  id?: string
  username: string
}
