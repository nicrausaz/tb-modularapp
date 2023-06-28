
// TODO: move these to a separate file
/**
 * Get a module by id
 * @param id id of the module
 * @returns the module, if it exists
 */
export const getModuleById = async (id: string) => {
  const response = await fetch(`/api/modules/${id}`)
  return await response.json()
}

/**
 * Authenticate a user
 * @param username username of the user
 * @param password password of the user
 * @returns the user token, if successful
 */
export const authenticate = async (username: string, password: string): Promise<string> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }
  
  return data.token
}

export const getAuthenticatedUser = async (token: string) => {
  const response = await fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Not authenticated')
  }

  return await response.json()
}

