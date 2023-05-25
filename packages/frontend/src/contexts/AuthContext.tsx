import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import * as Api from '@/api/api'

// tmp
type User = {
  id: number
  username: string
}

type ContextType = {
  authenticatedUser: User | null
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
}

const AuthContext = createContext<ContextType>({
  authenticatedUser: null,
  login: async (username: string, password: string) => {},
  logout: async () => {},
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setItem, removeItem } = useLocalStorage('auth_token')
  const [authenticatedUser, setAuthenticatedUser] = useState(null)

  const login = async (username: string, password: string) => {
    await Api.authenticate(username, password)
      .then((token) => {
        setItem(token)
        Api.getAuthenticatedUser().then((user) => {
          setAuthenticatedUser(user)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const logout = async () => {
    removeItem()
  }

  return <AuthContext.Provider value={{ authenticatedUser, login, logout }}>{children}</AuthContext.Provider>
}

/**
 * Hook for using auth context
 */
export const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider }
