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

    if (!response.ok) {
      const jsonData = await response.json()
      throw new Error(jsonData.message)
    }

    if (response.status === 204) {
      return null
    }

    return (await getJsonOrText(response)) as T
  } catch (error) {
    throw new Error(error)
  }
}

const getJsonOrText = async (response: Response) => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  } else {
    return await response.text()
  }
}
