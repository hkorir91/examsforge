import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.user, token: data.token, loading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true, message: data.message }
        } catch (err) {
          const error = err.response?.data?.error || 'Login failed'
          set({ error, loading: false })
          return { success: false, error }
        }
      },

      register: async (name, email, password, school) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.post('/auth/register', { name, email, password, school })
          set({ user: data.user, token: data.token, loading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true, message: data.message }
        } catch (err) {
          const error = err.response?.data?.error || 'Registration failed'
          set({ error, loading: false })
          return { success: false, error }
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null })
        delete api.defaults.headers.common['Authorization']
      },

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user })
        } catch {
          get().logout()
        }
      },

      updateProfile: async (updates) => {
        try {
          const { data } = await api.patch('/auth/profile', updates)
          set({ user: data.user })
          return { success: true }
        } catch (err) {
          return { success: false, error: err.response?.data?.error }
        }
      },
    }),
    {
      name: 'ssd-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      },
    }
  )
)
