import { useToast } from '~/composables/useToast'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const toast = useToast()
    
    // Override window.alert to automatically route messages to our beautiful toast system
    window.alert = (message: string) => {
      if (!message) return
      
      const msgLower = message.toLowerCase()
      if (
        msgLower.includes('success') || 
        msgLower.includes('berhasil') || 
        msgLower.includes('saved') || 
        msgLower.includes('created') || 
        msgLower.includes('updated') || 
        msgLower.includes('published') ||
        msgLower.includes('copied') ||
        msgLower.includes('disalin')
      ) {
        toast.success(message)
      } else if (
        msgLower.includes('failed') || 
        msgLower.includes('gagal') || 
        msgLower.includes('error') || 
        msgLower.includes('required') || 
        msgLower.includes('must') || 
        msgLower.includes('cannot') ||
        msgLower.includes('tidak') ||
        msgLower.includes('past') ||
        msgLower.includes('invalid')
      ) {
        toast.error(message)
      } else {
        toast.info(message)
      }
    }
  }
})
