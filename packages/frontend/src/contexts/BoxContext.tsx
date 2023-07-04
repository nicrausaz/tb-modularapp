import { iconUpdate, update } from '@/api/requests/box'
import LoadingTopBar from '@/components/LoadingTopBar'
import { useFetch } from '@/hooks/useFetch'
import { Box } from '@/models/Box'
import { createContext, useContext, useEffect, useState } from 'react'

type BoxContextType = {
  box: Box | null

  /**
   * Updates the box icon
   * Warning: Authentication is required @see useAuth
   * @param file file to upload
   */
  updateIcon: (file: File) => void

  /**
   * Updates the box name
   * @param name new name
   */
  updateBox: (name: string) => void
}

const BoxContext = createContext<BoxContextType>({} as BoxContextType)

const BoxProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, error } = useFetch<Box>('/api/box')
  const [box, setBox] = useState<Box | null>(null)

  useEffect(() => {
    if (data) {
      setBox(data)
    }
  }, [data])

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw new Error('Error fetching data')
  }

  if (!box) {
    return null
  }

  const updateIcon = async (file: File) => {
    const filename = await iconUpdate(file)
    setBox({ ...box, icon: filename })
  }

  const updateBox = (name: string) => {
    update(name).then(() => {
      setBox({ ...box, name })
    })
  }

  return <BoxContext.Provider value={{ box, updateIcon, updateBox }}>{children}</BoxContext.Provider>
}

const useBox = () => useContext(BoxContext)

export { BoxProvider, useBox }
