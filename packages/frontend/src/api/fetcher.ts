export default async function fetcher<T>(url: string, options?: RequestInit, auth = true) {
  let opts = { ...options }

  console.log(localStorage.getItem('auth_token'))

  if (auth) {
    opts = {
      ...opts,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    }
  }

  try {
    const response = await fetch(url, opts)

    if (!response.ok) {
      const jsonData = await response.json()
      throw new Error(jsonData.message)
    }

    if (response.status === 204) {
      return null
    }

    const jsonData = await response.json()
    return jsonData as T
  } catch (error) {
    throw new Error(error)
  }
}
