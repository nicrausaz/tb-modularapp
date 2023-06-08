import { useToast } from '@/contexts/ToastContext'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, closeToast } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="stack">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onAction={closeToast} />
        ))}
      </div>
    </div>
  )
}
