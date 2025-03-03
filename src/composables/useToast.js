import { ref } from 'vue'

const toast = ref({
  message: '',
  type: '',
  show: false
})

export function useToast() {
  const showToast = (message, type = 'info') => {
    toast.value = {
      message,
      type,
      show: true
    }
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  return {
    toast,
    showToast
  }
}
