import SuccessIcon from '@/assets/icons/SuccessIcon'
import WarningIcon from '@/assets/icons/WarningIcon'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorIcon from '../assets/icons/ErrorIcon'
import { ToastData } from '@/contexts/ToastContext'

type ToastProps = {
  toast: ToastData
  onAction: (id: string) => void
}

export default function Toast({ toast, onAction }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
    }, toast.duration)
    return () => clearInterval(interval)
  }, [toast.duration])

  if (!visible) return null

  const colors = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  }

  const icons = {
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
  }

  const alertClass = `alert shadow-lg ${colors[toast.type]}`

  return (
    <div className={alertClass}>
      {icons[toast.type]}
      <div>
        <h3 className="font-bold">{toast.title}</h3>
        <div className="text-xs">{toast.message}</div>
      </div>
      {toast.action && (
        <Link to={toast.action} className="btn btn-sm" onClick={() => onAction(toast.id)}>
          See
        </Link>
      )}
    </div>
  )
}
