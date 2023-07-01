import { BoxProvider } from '@/contexts/BoxContext'
import { LiveModulesProvider } from '@/contexts/LiveModules'
import { PropsWithChildren } from 'react'

/**
 * A layout that does not require authentication but still give access to the box context
 */
export default function UnrestrictedLayout({ children }: PropsWithChildren) {
  return (
    <BoxProvider>
      <LiveModulesProvider>{children}</LiveModulesProvider>
    </BoxProvider>
  )
}
