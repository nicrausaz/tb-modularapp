import { ErrorIcon } from '@/assets/icons'
import { useLiveEvents } from '@/contexts/LiveEvents'
import { useEffect, useState } from 'react'

export default function ModuleRender({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [render, setRender] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { source } = useLiveEvents()

  if (!source) {
    return null
  }

  useEffect(() => {
    const clear = () => {
      source.releaseModule(id, callback)
    }
    window.addEventListener('beforeunload', clear)

    const callback = (data: { render?: string; error?: string; subtype?: string; enabled?: boolean }) => {
      if (data.subtype === 'status') {
        setStatus(data.enabled ? 'active' : 'error')
        setError(data.enabled ? '' : 'Module disabled')
        setLoading(data.enabled ?? false)
        return
      }

      setLoading(false)
      setError('')

      if (data.error) {
        setStatus('error')
        setError(data.error)
        return
      }

      if (data.render) {
        setStatus('active')
        setRender(data.render)
      }
    }

    source.getModule(id, callback)

    return () => {
      source.releaseModule(id, callback)
      window.removeEventListener('beforeunload', clear)
    }
  }, [id])

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="w-full h-full bg-error">
        <div className="flex flex-col items-center justify-center h-full">
          <ErrorIcon />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: render }}
      className="w-full h-full border max-w-full max-h-full flex justify-center"
    />
  )
}
