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
