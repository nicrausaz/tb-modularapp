import { Screen } from '@/models/Screen'
import fetcher from '../fetcher'

export const createOrSave = async (screen: Screen) => {
  return fetcher(`/api/screens/${screen.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(screen),
  })
}

export const remove = async (screenId: number) => {
  return fetcher(`/api/screens/${screenId}`, {
    method: 'DELETE',
  })
}