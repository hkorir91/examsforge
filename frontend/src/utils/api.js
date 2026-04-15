import axios from 'axios'

const api = axios.create({
  import.meta.env.VITE_API_URL || 'https://examsforge.onrender.com/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('ssd-auth')
    if (stored) {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ssd-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
