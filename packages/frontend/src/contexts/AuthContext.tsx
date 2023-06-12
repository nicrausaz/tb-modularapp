import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { User } from '@/models/User'
import * as Api from '@/api/api'

type AuthContextType = {
  token: string
  authenticatedUser: User | null
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
  getAuthenticatedUser(): Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken, remove] = useLocalStorage('auth_token', '')
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null)

  const login = async (username: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      Api.authenticate(username, password)
        .then((t) => {
          setToken(t)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const logout = async () => {
    return new Promise<void>((resolve) => {
      remove()
      setAuthenticatedUser(null)
      resolve()
    })
  }

  const getAuthenticatedUser = async () => {
    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const user = await response.json()

    if (!user) {
      throw new Error('Not authenticated')
    }
    setAuthenticatedUser(user)
  }

  return (
    <AuthContext.Provider value={{ authenticatedUser, login, logout, getAuthenticatedUser, token }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook for using auth context
 */
export const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider }
