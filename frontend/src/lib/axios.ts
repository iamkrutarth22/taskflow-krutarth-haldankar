import axios from "axios"
import store from "../store"
import { logout } from "../store/authSlice"

const API_URL =import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.token

  const publicEndpoints = ["/auth/login", "/auth/register"]
  const isPublic = publicEndpoints.some((ep) => config.url?.includes(ep))

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {

    if (error.response?.status === 401) {
      const isAuthPage = ["/login", "/register"].includes(window.location.pathname)
      if (!isAuthPage) {
        store.dispatch(logout())
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api