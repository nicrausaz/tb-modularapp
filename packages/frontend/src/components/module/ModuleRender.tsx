import { CrossIcon } from '@/assets/icons'
import ErrorIcon from '@/assets/icons/ErrorIcon'
import { useEffect, useState } from 'react'

export default function ModuleRender({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [render, setRender] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const source = new EventSource(`/api/modules/${id}/events`)

    source.onmessage = (e) => {
      setRender(e.data)
    }

    source.onopen = () => {
      setLoading(false)
      setStatus('active')
    }

    source.onerror = () => {
      setLoading(false)
      setStatus('error')
    }

    return () => {
      console.log('close on client')
      source.close()
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
          <span>Module disabled or fatal error</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full ">
      <div dangerouslySetInnerHTML={{ __html: render }} />
    </div>
  )
}
