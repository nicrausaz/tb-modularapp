import { ErrorIcon } from '@/assets/icons'
import { useLiveModules } from '@/contexts/LiveModules'
import { useEffect, useState } from 'react'

export default function ModuleRender({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [render, setRender] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const { source } = useLiveModules()

  if (!source) {
    return null
  }

  useEffect(() => {
    const callback = (render: string) => {
      setLoading(false)
      setStatus('active')
      setRender(render)
    }

    source?.get(id, callback)

    return () => {
      source?.release(id, callback)
    }
  }, [])

  //

  // useEffect(() => {
  //   // TODO: create a custom hook for this (context) ?
  //   // const source = new ModulesEventManager('ws://localhost:3000/events', 'modules')
  //   const source = new ModulesEventManager()
  //     .acquire()
  //     .then((s) => s)
  //     .catch(() => null)

  //   if (source === null) {
  //     // toast error
  //     return
  //   }

  //   // const source = new EventSource(`/api/modules/${id}/events`)

  //   // source.onmessage = (e) => {
  //   //   setRender(e.data)
  //   // }

  //   // source.onopen = () => {
  //   //   setLoading(false)
  //   //   setStatus('active')
  //   // }

  //   // source.onerror = () => {
  //   //   setLoading(false)
  //   //   setStatus('error')
  //   // }

  //   // return () => {
  //   //   console.log('close on client')
  //   //   source.close()
  //   // }
  //   return () => {
  //     console.log('close on client')
  //     source.then((s) => s?.release(id))
  //   }
  // }, [id])

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
