import ScreenEditor from '@/components/screens/ScreenEditor'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen } from '@/models/Screen'
import { useParams } from 'react-router-dom'
// import { fullscreen, closeFullscreen } from '@/helpers'

export default function Visualize() {
  const { screenId } = useParams()
  const { data: screen, error, loading } = useFetchAuth<Screen>(`/api/screens/${screenId}`)
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

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
