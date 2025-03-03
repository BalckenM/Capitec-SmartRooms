import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  // Add any request interceptors here
  return config
})

apiClient.interceptors.response.use(response => {
  // Add any response interceptors here
  return response
}, error => {
  // Handle errors
  return Promise.reject(error)
})

export default apiClient
