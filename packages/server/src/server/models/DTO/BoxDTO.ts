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
  readonly key: string
}