export default async function fetcher<T>(url: string, options?: RequestInit, auth = true) {
  let opts = { ...options }

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
    const jsonData = await response.json()

    if (!response.ok) {
      throw new Error(jsonData.message)
    }

    return jsonData as T
  } catch (error) {
    throw new Error(error)
  }
}
