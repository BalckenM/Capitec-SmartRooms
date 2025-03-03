<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const devices = ref([])
const { showToast } = useToast()

const fetchDevices = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/devices')
    devices.value = data
  } catch (err) {
    error.value = err.message
    showToast('Failed to load devices', 'error')
  } finally {
    loading.value = false
  }
}

const updateDeviceStatus = async (deviceId, status) => {
  try {
    await api.patch(`/devices/${deviceId}/status`, { status })
    showToast('Device status updated', 'success')
  } catch (err) {
    showToast('Failed to update device status', 'error')
  }
}

onMounted(() => {
  fetchDevices()
})
</script>

<template>
  <div class="devices-view">
    <LoadingSpinner :loading="loading" message="Loading devices..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchDevices">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Smart Devices</h1>
        <button class="add-btn">
          <span class="material-icons">add</span>
          Add Device
        </button>
      </div>

      <div class="devices-grid">
        <!-- Grid content will go here -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.devices-view {
  position: relative;
  min-height: 200px;
  padding: 1rem;
}

.content {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .devices-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>
