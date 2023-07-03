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
