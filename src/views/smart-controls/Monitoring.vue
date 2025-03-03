<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const monitoringData = ref({
  rooms: [
    {
      id: 1,
      name: 'Executive Suite',
      status: 'occupied',
      occupancy: 8,
      temperature: 22.5,
      humidity: 45,
      devices: [
        { name: 'AC', status: 'on', value: '22°C' },
        { name: 'Lights', status: 'on', value: '80%' },
        { name: 'Projector', status: 'on', usage: '2h 15m' },
        { name: 'Air Quality', status: 'good', co2: '450ppm' }
      ]
    },
    {
      id: 2,
      name: 'Innovation Lab',
      status: 'available',
      occupancy: 0,
      temperature: 23.0,
      humidity: 42,
      devices: [
        { name: 'AC', status: 'on', value: '23°C' },
        { name: 'Lights', status: 'off' },
        { name: 'Projector', status: 'off' },
        { name: 'Air Quality', status: 'excellent', co2: '400ppm' }
      ]
    }
  ],
  systemStatus: {
    network: 'operational',
    servers: 'operational',
    automation: 'operational',
    lastUpdate: new Date().toISOString()
  }
})

const { showToast } = useToast()
let updateInterval

const fetchMonitoringData = async () => {
  try {
    loading.value = true
    // Simulate real-time data fetch
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In real implementation, fetch from API
    monitoringData.value.systemStatus.lastUpdate = new Date().toISOString()
  } catch (err) {
    error.value = err.message
    showToast('Failed to update monitoring data', 'error')
  } finally {
    loading.value = false
  }
}

const startRealTimeUpdates = () => {
  updateInterval = setInterval(fetchMonitoringData, 30000) // Update every 30 seconds
}

const stopRealTimeUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
}

onMounted(() => {
  fetchMonitoringData()
  startRealTimeUpdates()
})

onUnmounted(() => {
  stopRealTimeUpdates()
})

const getStatusColor = (status) => {
  const colors = {
    operational: '#16a34a',
    degraded: '#d97706',
    down: '#dc2626'
  }
  return colors[status] || '#6b7280'
}
</script>

<template>
  <div class="monitoring-view">
    <LoadingSpinner :loading="loading" message="Loading monitoring data..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchMonitoringData">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>System Monitoring</h1>
        <div class="system-status">
          <span class="status-label">System Status:</span>
          <div class="status-indicators">
            <div v-for="(status, key) in monitoringData.systemStatus" 
                 :key="key"
                 class="status-item"
                 v-if="key !== 'lastUpdate'"
            >
              <span class="status-dot" 
                    :style="{ background: getStatusColor(status) }">
              </span>
              {{ key }}
            </div>
          </div>
          <span class="last-update">
            Last updated: {{ new Date(monitoringData.systemStatus.lastUpdate).toLocaleTimeString() }}
          </span>
        </div>
      </div>

      <div class="rooms-grid">
        <div v-for="room in monitoringData.rooms" 
             :key="room.id" 
             class="room-card"
        >
          <div class="room-header">
            <h3>{{ room.name }}</h3>
            <span :class="['status-badge', room.status]">
              {{ room.status }}
            </span>
          </div>
          
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="material-icons">group</span>
              <div class="metric-info">
                <span class="metric-label">Occupancy</span>
                <span class="metric-value">{{ room.occupancy }} people</span>
              </div>
            </div>
            <div class="metric-item">
              <span class="material-icons">thermostat</span>
              <div class="metric-info">
                <span class="metric-label">Temperature</span>
                <span class="metric-value">{{ room.temperature }}°C</span>
              </div>
            </div>
            <div class="metric-item">
              <span class="material-icons">water_drop</span>
              <div class="metric-info">
                <span class="metric-label">Humidity</span>
                <span class="metric-value">{{ room.humidity }}%</span>
              </div>
            </div>
          </div>

          <div class="devices-list">
            <div v-for="device in room.devices" 
                 :key="device.name"
                 class="device-item"
            >
              <span class="device-name">{{ device.name }}</span>
              <span :class="['device-status', device.status]">
                {{ device.status }} {{ device.value || device.usage || device.co2 || '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monitoring-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.status-indicators {
  display: flex;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.last-update {
  color: #6b7280;
  font-size: 0.875rem;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.room-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.metric-value {
  font-weight: 500;
  color: #1f2937;
}

.devices-list {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.device-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.device-status {
  font-size: 0.875rem;
  text-transform: capitalize;
}

.device-status.on {
  color: #16a34a;
}

.device-status.off {
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

.status-badge.occupied {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.available {
  background: #dcfce7;
  color: #16a34a;
}

@media (max-width: 768px) {
  .rooms-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .system-status {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-indicators {
    flex-wrap: wrap;
  }
}
</style>
