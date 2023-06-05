import { Configuration } from "./Configuration"

export type Module = {
  id: string
  name: string
  description: string
  author: string
  version: string
  enabled: boolean
  currentConfig: Configuration
}
