export type ModuleEntity = {
  id: string
  name: string
  nickname?: string
  icon?: string
  description: string
  version: string
  author: string
  configuration: object
  enabled: boolean
  importedAt: Date
}
