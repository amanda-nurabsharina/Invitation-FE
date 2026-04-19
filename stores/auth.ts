import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  role: string
  full_name?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(identifier: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        
        // Determine if identifier is email or username
        const isEmail = identifier.includes('@')
        const body = isEmail 
          ? { email: identifier, password } 
          : { username: identifier, password }
        
        const response = await $fetch<any>(`${config.public.apiBaseUrl}/auth/login`, {
          method: 'POST',
          body,
        })

        if (response.error) {
          throw new Error(response.message)
        }

        this.accessToken = response.data.access_token
        this.refreshToken = response.data.refresh_token

        // Decode JWT to get user info
        const payload = JSON.parse(atob(this.accessToken!.split('.')[1]))
        this.user = {
          id: payload.user_id,
          email: payload.email,
          role: payload.role,
          full_name: payload.full_name,
        }

        // Store in localStorage
        if (process.client) {
          localStorage.setItem('accessToken', this.accessToken!)
          localStorage.setItem('refreshToken', this.refreshToken!)
        }

        return true
      } catch (error: any) {
        this.error = error.message || 'Login failed'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
      } catch (error) {
        // Ignore logout errors
      }

      this.user = null
      this.accessToken = null
      this.refreshToken = null

      if (process.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) return false

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.apiBaseUrl}/auth/refresh-token`, {
          method: 'POST',
          body: { refresh_token: this.refreshToken },
        })

        if (response.error) {
          throw new Error(response.message)
        }

        this.accessToken = response.data.access_token
        this.refreshToken = response.data.refresh_token

        if (process.client) {
          localStorage.setItem('accessToken', this.accessToken!)
          localStorage.setItem('refreshToken', this.refreshToken!)
        }

        return true
      } catch (error) {
        await this.logout()
        return false
      }
    },

    initFromStorage() {
      if (process.client) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken

          // Decode JWT to get user info
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]))
            this.user = {
              id: payload.user_id,
              email: payload.email,
              role: payload.role,
              full_name: payload.full_name,
            }
          } catch (error) {
            // Invalid token, clear storage
            this.logout()
          }
        }
      }
    },
  },
})
