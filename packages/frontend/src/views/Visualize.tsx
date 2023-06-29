import ScreenEditor from '@/components/screens/ScreenEditor'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen } from '@/models/Screen'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import { fullscreen, closeFullscreen } from '@/helpers'

export default function Visualize() {
  const { screenId } = useParams()
  // const { data: screen, error, loading } = useFetchAuth<Screen>(`/api/screens/${screenId}`)
  // const container = useRef<HTMLDivElement>(null)
  // const toggler = useRef<HTMLButtonElement>(null)

  // useEffect(() => {
  //   // fullscreen()
  //   // console.log(toggler.current)
  //   // console.log(container.current)
  //   // if (toggler.current) {
  //   //   console.log('clicking')
  //   //   toggler.current.click()
  //   // }

  //   // return () => closeFullscreen()
  // }, [])

  const [screen, setScreen] = useState<Screen>()

  useEffect(() => {
    const source = new EventSource(`/api/screens/${screenId}/events`)

    source.onmessage = (e) => {
      setScreen(JSON.parse(e.data))
    }

    source.onopen = () => {
      // setLoading(false)
      // setStatus('active')
    }

    source.onerror = () => {
      // TODO
      // setLoading(false)
      // setStatus('error')
    }

    return () => {
      console.log('close on client')
      source.close()
    }
  }, [screenId])

  if (!screen) {
    return null
  }
  // {/* <button hidden={false} onClick={() => fullscreen()} ref={toggler}></button> */}
  // ref={container}

  return (
    <div className="h-screen w-screen">
      <ScreenEditor slots={screen.slots} readonly={true} containerClassName="h-screen w-screen" />
    </div>
  )
}
