import axios from 'axios'

// In production (Vercel), add VITE_API_URL as an Environment Variable in your
// Vercel project settings pointing to your backend, e.g.:
//   VITE_API_URL=https://examsforge-api.onrender.com/api
// In local dev, Vite proxies /api to localhost:5000 via vite.config.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
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
