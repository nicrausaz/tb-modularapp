import fetcher from '@/api/fetcher'
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
    const formData = new FormData()
    formData.append('file', file)

    const data = await fetcher<{ filename: string }>('/api/box/icon', {
      method: 'PUT',
      body: formData,
    })

    console.log(data)

    setBox({ ...box, icon: data.filename })
  }

  return <BoxContext.Provider value={{ box, updateIcon }}>{children}</BoxContext.Provider>
}

const useBox = () => useContext(BoxContext)

export { BoxProvider, useBox }
