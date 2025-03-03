<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const lightingStatus = ref('off')

const toggleLighting = async () => {
  try {
    const response = await axios.post(`/api/rooms/${props.roomId}/lighting`, {
      status: lightingStatus.value === 'off' ? 'on' : 'off'
    })
    lightingStatus.value = response.data.status
  } catch (error) {
    console.error('Failed to toggle lighting:', error)
  }
}
</script>

<template>
  <div class="smart-lighting-control">
    <h3>Smart Lighting Control</h3>
    <button class="btn btn-primary" @click="toggleLighting">
      Turn {{ lightingStatus === 'off' ? 'On' : 'Off' }} Lights
    </button>
  </div>
</template>

<style scoped>
.smart-lighting-control {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 1.5rem;
}

.smart-lighting-control h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.btn {
  margin-top: 1rem;
  width: 100%;
}
</style>
