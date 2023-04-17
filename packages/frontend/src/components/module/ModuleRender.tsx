import { useEffect, useState } from 'react'

export default function ModuleRender({ id }) {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [render, setRender] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const source = new EventSource(`/api/modules/${id}`)

    source.addEventListener(
      'message',
      (e) => {
        console.log(e)
        setData(JSON.parse(e.data).data)
        setRender(JSON.parse(e.data).render)
      },
      false,
    )

    source.addEventListener(
      'open',
      function (e) {
        console.log('open')
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

  return (
    <div className="border rounded-xl bg-base-200">
      {loading ? <div>Loading...</div> : <div dangerouslySetInnerHTML={{ __html: render }} />}
    </div>
  )
}
