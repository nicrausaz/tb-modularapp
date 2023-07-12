import { useToast } from '@/contexts/ToastContext'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, closeToast } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed toast toast-top toast-center z-50">
      <div className="stack">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onAction={closeToast} onClose={closeToast} />
        ))}
      </div>
    </div>
  )
}
