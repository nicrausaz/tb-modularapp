import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import * as Api from '@/api/api'

// tmp
type User = {
  id: number
  username: string
}

type ContextType = {
  token: string
  authenticatedUser: User | null
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
  getAuthenticatedUser(): Promise<void>
}

const AuthContext = createContext<ContextType>({
  token: '',
  authenticatedUser: null,
  login: async (username: string, password: string) => {},
  logout: async () => {},
  getAuthenticatedUser: async () => {},
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken, remove] = useLocalStorage('auth_token', '')
  const [authenticatedUser, setAuthenticatedUser] = useState(null)

  const login = async (username: string, password: string) => {
    await Api.authenticate(username, password).then(async (t) => {
      setToken(t)
      await getAuthenticatedUser()
    })
  }

  const logout = async () => {
    remove()
  }

  const getAuthenticatedUser = async () => {
    await Api.getAuthenticatedUser()
      .then((user) => {
        setAuthenticatedUser(user)
      })
      .catch((err) => {
        console.log(err)
      })
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
