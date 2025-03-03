import { ref } from 'vue'
import api from '../services/api'
import { handleApiError, handleError } from '../utils/errorHandler'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const execute = async (apiCall, options = {}) => {
    const {
      onSuccess,
      onError,
      throwError = false,
      context = ''
    } = options

    loading.value = true
    error.value = null

    try {
      const response = await apiCall()
      
      if (onSuccess) {
        await onSuccess(response.data)
      }
      
      return response.data
    } catch (err) {
      error.value = handleApiError(err)
      
      if (onError) {
        await onError(error.value)
      }
      
      if (throwError) {
        throw error.value
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute
  }
}
