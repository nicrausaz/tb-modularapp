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
        const response = await fetch(url, options)
        const jsonData = await response.json()
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
  const opts = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  }

  return useFetch<T>(url, opts)
}

export { useFetch, useFetchAuth }
