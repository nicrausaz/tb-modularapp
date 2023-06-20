export type User = {
  id: number
  username: string
}

export type UserCreate = {
  id?: number
  username: string
  password: string
}