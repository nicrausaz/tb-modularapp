import ScreenEditor from '@/components/screens/ScreenEditor'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen } from '@/models/Screen'
import { useParams } from 'react-router-dom'

export default function Visualize() {
  const { screenId } = useParams()
  const { data: screen, error, loading } = useFetchAuth<Screen>(`/api/screens/${screenId}`)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

  if (!screen) {
    return null
  }

  return (
    <div className="h-screen w-screen bg-green-200">
      <ScreenEditor slots={screen.slots} />
    </div>
  )
}
