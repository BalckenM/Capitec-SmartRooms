import { defineStore } from 'pinia'
import api from '../services/api'

const DEV_USER = {
  id: 1,
  name: 'Admin User',
  email: 'admin@meltscloud.com',
  role: 'admin',
  permissions: ['*'],
  isPro: true
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false
  }),

  actions: {
    async login({ email, password, remember }) {
      this.loading = true
      
      try {
        // In development, skip API call and use mock data
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
          const mockToken = 'dev-token-' + Date.now()
          this.setToken(mockToken)
          this.setUser(DEV_USER)
          this.isAuthenticated = true

          if (remember) {
            localStorage.setItem('auth_token', mockToken)
            localStorage.setItem('auth_user', JSON.stringify(DEV_USER))
          }
          
          return { data: { token: mockToken, user: DEV_USER } }
        }

        // Make API call to login endpoint
        const response = await api.post('/auth/login', { email, password })
        const { token, user } = response.data

        // Store auth data
        this.setToken(token)
        this.setUser(user)
        this.isAuthenticated = true

        // Set token in API client
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Store in localStorage if remember is true
        if (remember) {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('auth_user', JSON.stringify(user))
        }

        return response
      } catch (error) {
        // In development, log the error but don't clear auth
        if (!import.meta.env.DEV) {
          this.clearAuth()
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        // Call logout endpoint if needed
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    setToken(token) {
      this.token = token
      api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null
    },

    setUser(user) {
      this.user = user
    },

    clearAuth() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      api.defaults.headers.common['Authorization'] = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    async initAuth() {
      // Check for stored token
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('auth_user')

      if (token && userData) {
        try {
          // Verify token is still valid
          const response = await api.post('/auth/verify', { token })
          
          if (response.data.valid) {
            this.setToken(token)
            this.setUser(JSON.parse(userData))
            this.isAuthenticated = true
          } else {
            this.clearAuth()
          }
        } catch (error) {
          this.clearAuth()
        }
      }
    },

    async refreshToken() {
      try {
        const response = await api.post('/auth/refresh')
        const { token } = response.data
        this.setToken(token)
        localStorage.setItem('auth_token', token)
        return token
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async updateProfile(userData) {
      try {
        const response = await api.put('/auth/profile', userData)
        this.setUser(response.data)
        localStorage.setItem('auth_user', JSON.stringify(response.data))
        return response.data
      } catch (error) {
        throw error
      }
    },

    async changePassword({ currentPassword, newPassword }) {
      try {
        await api.put('/auth/password', {
          currentPassword,
          newPassword
        })
      } catch (error) {
        throw error
      }
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    hasPermission: (state) => (permission) => {
      return state.user?.permissions?.includes(permission) || false
    }
  }
})
