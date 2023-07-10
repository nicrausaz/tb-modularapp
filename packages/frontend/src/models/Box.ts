export type Box = {
  name: string
  readonly picture: string
  readonly version: string
  readonly icon?: string
}

export type APIKey = {
  readonly id: number
  readonly name: string
  readonly key: string
  readonly display: string
  readonly createdAt: Date
}
