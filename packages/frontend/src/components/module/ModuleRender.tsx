import { useEffect, useState } from 'react'

export default function ModuleRender({ id }: { id: string }) {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [render, setRender] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const source = new EventSource(`/api/modules/${id}/events`)

    source.addEventListener(
      'message',
      (e) => {
        setData(JSON.parse(e.data).data)
        setRender(JSON.parse(e.data).render)
      },
      false,
    )

    source.addEventListener(
      'open',
      function (e) {
        setLoading(false)
        setStatus('active')
      },
      false,
    )
    source.addEventListener(
      'error',
      function (e) {
        console.log('error', e)
        setStatus('error')
      },
      false,
    )

    return () => {
      source.close()
    }
  }, [])

  if (loading) {
    // todo: center
    return (
      <div className="w-full h-full">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="w-full h-full ">
      <div dangerouslySetInnerHTML={{ __html: render }} />
    </div>
  )
}
