import { useSwipe } from '@vueuse/core'
import { ref } from 'vue'

export function useSidebarTouch(isOpen, emit) {
  const target = ref(null)
  
  const { isSwiping, direction } = useSwipe(target, {
    onSwipeEnd(e, direction) {
      if (direction === 'left' && isOpen.value) {
        emit('toggle-sidebar')
      } else if (direction === 'right' && !isOpen.value) {
        emit('toggle-sidebar')
      }
    }
  })

  return {
    target,
    isSwiping
  }
}
