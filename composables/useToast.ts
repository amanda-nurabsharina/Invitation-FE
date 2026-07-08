import { ref, computed } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

export const useToast = () => {
  const show = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = nextId++
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  const success = (message: string, duration = 3000) => show(message, 'success', duration)
  const error = (message: string, duration = 4000) => show(message, 'error', duration)
  const info = (message: string, duration = 3000) => show(message, 'info', duration)
  const warning = (message: string, duration = 3000) => show(message, 'warning', duration)

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts: computed(() => toasts.value),
    show,
    success,
    error,
    info,
    warning,
    remove
  }
}
