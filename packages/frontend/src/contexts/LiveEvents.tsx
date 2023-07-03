import EventsEventManager from '@/api/events/EventsManager'
import React, { createContext, useState, useContext } from 'react'
import { useEffect } from 'react'

type LiveEventsType = {
  source: EventsEventManager | null
}

const LiveEventsContext = createContext<LiveEventsType>({} as LiveEventsType)

/**
 * Access to the live Events using the EventsEventManager
 */
const LiveEventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [source, setSource] = useState<EventsEventManager | null>(null)

  useEffect(() => {
    setSource(new EventsEventManager())
  }, [])

  return <LiveEventsContext.Provider value={{ source }}>{children}</LiveEventsContext.Provider>
}

const useLiveEvents = () => useContext(LiveEventsContext)

export { LiveEventsProvider, useLiveEvents }
