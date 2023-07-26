import LoadingTopBar from '@/components/LoadingTopBar'
import ScreenEditor from '@/components/screens/ScreenEditor'
import { useLiveEvents } from '@/contexts/LiveEvents'
import { Screen } from '@/models/Screen'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

/**
 * Screen visualization page
 */
export default function Visualize() {
  const { screenId } = useParams()
  const [screen, setScreen] = useState<Screen>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const { source } = useLiveEvents()

  useEffect(() => {
    if (!source || !screenId) {
      return
    }

    const clear = () => {
      source.releaseScreen(parseInt(screenId), callback)
    }
    window.addEventListener('beforeunload', clear)

    const callback = (data: { data: Screen; error: string; id: string }) => {
      setError('')
      setLoading(false)

      if (data.error) {
        setError(data.error)
        return
      }
      setScreen(data.data)
    }

    source.getScreen(parseInt(screenId), callback)

    return () => {
      source.releaseScreen(parseInt(screenId), callback)
      window.removeEventListener('beforeunload', clear)
    }
  }, [screenId, source])

  if (loading) {
    <LoadingTopBar />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-primary to-accent">
        <div className="px-40 py-20 bg-white rounded-md shadow-xl">
          <div className="flex flex-col items-center">
            <h6 className="mb-2 text-2xl font-bold text-center text-neutral md:text-3xl">
              <span className="text-error">{error}</span>
            </h6>
          </div>
        </div>
      </div>
    )
  }

  if (!screen) {
    return null
  }

  return (
    <div className="h-screen w-screen bg-base-200">
      <ScreenEditor slots={screen.slots} readonly={true} containerClassName="h-screen w-screen" />
    </div>
  )
}
