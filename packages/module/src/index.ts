import Module, { ModuleProps } from './module/Module'
import ModuleRenderer from './module/ModuleRenderer'
import { Configuration } from './module/configuration/Configuration'
import { SpecificConfiguration } from './module/configuration/SpecificConfiguration'
import {
  SpecificConfigurationEntry,
  SpecificConfigurationEntryTypeValue,
} from './module/configuration/SpecificConfigurationEntry'
import { schema as ModuleValidationSchema } from './schema'

export {
  Configuration,
  Module,
  ModuleRenderer,
  ModuleProps,
  SpecificConfiguration,
  SpecificConfigurationEntry,
  SpecificConfigurationEntryTypeValue,
  ModuleValidationSchema,
}
