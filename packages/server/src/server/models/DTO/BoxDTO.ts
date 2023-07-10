export type BoxDTO = {
  readonly name: string
  readonly version: string
  readonly icon?: string
}

export type UpdateBoxDTO = {
  readonly name: string
}

export type APIKeyDTO = {
  readonly id: string
  readonly name: string
  readonly display: string
  readonly createdAt: Date
}

export type GenerateAPIKeyDTO = {
  readonly name: string
}

export type CreateAPIKeyDTO = {
  readonly key: string
  readonly name: string
  readonly display: string
}
