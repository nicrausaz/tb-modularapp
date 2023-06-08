import React, { createContext, useContext, useState } from 'react'

type ToastType = 'success' | 'warning' | 'error'

export type ToastData = {
  id: string
  title: string
  message: string
  type: ToastType
  action?: string
  duration?: number
}

type ToastContextType = {
  toasts: Array<ToastData>
  tSuccess: (title: string, message: string, action?: string, duration?: number) => void
  tWarning: (title: string, message: string, action?: string, duration?: number) => void
  tError: (title: string, message: string, action?: string, duration?: number) => void
  closeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (title: string, message: string, type: ToastType, action?: string, duration = 3000) => {
    const toast = {
      id: Date.now().toString(),
      title,
      message,
      type,
      action,
      duration,
    }
    setToasts([...toasts, toast])
  }

  const closeToast = (id: string) => {
    setToasts(toasts.filter((toast) => toast.id !== id))
  }

  const tSuccess = (title: string, message: string, action?: string, duration?: number) => {
    addToast(title, message, 'success', action, duration)
  }

  const tWarning = (title: string, message: string, action?: string, duration?: number) => {
    addToast(title, message, 'warning', action, duration)
  }

  const tError = (title: string, message: string, action?: string, duration?: number) => {
    addToast(title, message, 'error', action, duration)
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        tSuccess,
        tWarning,
        tError,
        closeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

const useToast = () => useContext(ToastContext)

export { useToast, ToastProvider }
