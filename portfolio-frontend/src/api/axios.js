import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_token')
      localStorage.removeItem('portfolio_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default API