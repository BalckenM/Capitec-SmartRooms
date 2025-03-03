import { useToast } from '../composables/useToast'

export const handleApiError = (error) => {
  const { showToast } = useToast()
  const status = error.response?.status
  const data = error.response?.data

  // Handle specific error codes
  switch (status) {
    case 400:
      showToast(data.message || 'Invalid request', 'error')
      break
    case 401:
      showToast('Unauthorized access', 'error')
      break
    case 403:
      showToast('Access forbidden', 'error')
      break
    case 404:
      showToast('Resource not found', 'error')
      break
    case 422:
      // Validation errors
      const validationErrors = Object.values(data.errors || {}).flat()
      showToast(validationErrors[0] || 'Validation failed', 'error')
      break
    case 429:
      showToast('Too many requests. Please try again later.', 'error')
      break
    case 500:
      showToast('Internal server error', 'error')
      break
    default:
      showToast('An unexpected error occurred', 'error')
  }

  // Log error for debugging
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      status,
      message: error.message,
      data: error.response?.data
    })
  }

  return error
}

export const handleError = (error, context = '') => {
  const { showToast } = useToast()
  
  // Log error
  console.error(`Error in ${context}:`, error)
  
  // Show user-friendly message
  showToast(
    import.meta.env.DEV ? error.message : 'An error occurred',
    'error'
  )
  
  return error
}
