import { useEffect, useState } from 'react'

export const useLocalStorage = (key: string, fallback: string) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? fallback)

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  const remove = () => {
    localStorage.removeItem(key)
    setValue(fallback)
  }

  return [value, setValue, remove] as const
}
