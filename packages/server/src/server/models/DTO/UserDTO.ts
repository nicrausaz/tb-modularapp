export type UserDTO = {
  id: number
  username: string
  avatar?: string
  isDefault: boolean
}

export type LoginUserDTO = {
  username: string
  password: string
}

export type CreateUserDTO = {
  username: string
  password: string
}

export type UpdateUserDTO = {
  username: string
  password?: string
}
