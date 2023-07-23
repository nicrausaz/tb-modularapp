import fetcher from '@/api/fetcher'
import { useState, useEffect } from 'react'

interface FetchProps<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

const useFetch = <T>(url: string, options?: RequestInit): FetchProps<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const jsonData = await fetcher<T>(url, options, false)
        setData(jsonData)
        setLoading(false)
      } catch (error) {
        setError(error as Error)
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options])

  return { data, error, loading }
}

const useFetchAuth = <T>(url: string, options?: RequestInit): FetchProps<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const jsonData = await fetcher<T>(url, options)
        setData(jsonData)
        setLoading(false)
      } catch (error) {
        setError(error as Error)
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options])

  return { data, error, loading }
}

export { useFetch, useFetchAuth }
