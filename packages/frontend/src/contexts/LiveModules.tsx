import ModulesEventManager from '@/api/events/ModulesEventManager'
import React, { createContext, useState, useContext } from 'react'
import { useEffect } from 'react'

type LiveModulesType = {
  source: ModulesEventManager | null
}

const LiveModulesContext = createContext<LiveModulesType>({} as LiveModulesType)

/**
 * Access to the live modules using the ModulesEventManager
 */
const LiveModulesProvider = ({ children }: { children: React.ReactNode }) => {
  const [source, setSource] = useState<ModulesEventManager | null>(null)

  useEffect(() => {
    setSource(new ModulesEventManager())
  }, [])

  return <LiveModulesContext.Provider value={{ source }}>{children}</LiveModulesContext.Provider>
}

const useLiveModules = () => useContext(LiveModulesContext)

export { LiveModulesProvider, useLiveModules }
