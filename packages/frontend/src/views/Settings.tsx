import { useEffect, useState } from 'react'

export default function Settings() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const source = new EventSource('/api/modules/hello-module')

    source.addEventListener(
      'message',
      (e) => {
        console.log('message', e)
        setData(e.data)
      },
      false,
    )

    source.addEventListener(
      'open',
      function (e) {
        console.log('open')
      },
      false,
    )
    source.addEventListener(
      'error',
      function (e) {
        console.log('error', e)
      },
      false,
    )
  }, [])

  return (
    <div>
      <h1>Settings</h1>

      <p>data: {data}</p>
    </div>
  )
}
