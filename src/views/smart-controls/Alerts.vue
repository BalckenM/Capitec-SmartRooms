<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const alerts = ref([
  {
    id: 1,
    type: 'critical',
    room: 'Executive Suite',
    device: 'AC System',
    message: 'Temperature sensor malfunction detected',
    timestamp: '2024-03-02T10:30:00Z',
    status: 'unresolved'
  },
  {
    id: 2,
    type: 'warning',
    room: 'Innovation Lab',
    device: 'Projector',
    message: 'Lamp life below 20%',
    timestamp: '2024-03-02T09:15:00Z',
    status: 'acknowledged'
  },
  {
    id: 3,
    type: 'info',
    room: 'Executive Suite',
    device: 'Air Quality Monitor',
    message: 'CO2 levels slightly elevated',
    timestamp: '2024-03-02T11:00:00Z',
    status: 'resolved'
  }
])

const filterStatus = ref('all')
const filterType = ref('all')
const searchQuery = ref('')

const { showToast } = useToast()

const fetchAlerts = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load alerts', 'error')
  } finally {
    loading.value = false
  }
}

const updateAlertStatus = async (alertId, newStatus) => {
  try {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = newStatus
      showToast('Alert status updated', 'success')
    }
  } catch (err) {
    showToast('Failed to update alert status', 'error')
  }
}

const getAlertTypeIcon = (type) => {
  const icons = {
    critical: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[type] || 'help'
}

onMounted(() => {
  fetchAlerts()
})
</script>

<template>
  <div class="alerts-view">
    <LoadingSpinner :loading="loading" message="Loading alerts..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchAlerts">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>System Alerts</h1>
        <div class="alert-filters">
          <div class="search-box">
            <span class="material-icons">search</span>
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="Search alerts..."
            >
          </div>
          <select v-model="filterType">
            <option value="all">All Types</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select v-model="filterStatus">
            <option value="all">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div class="alerts-list">
        <div v-for="alert in alerts" 
             :key="alert.id" 
             class="alert-card"
             :class="alert.type"
        >
          <div class="alert-icon">
            <span class="material-icons">{{ getAlertTypeIcon(alert.type) }}</span>
          </div>
          
          <div class="alert-content">
            <div class="alert-header">
              <h3>{{ alert.room }} - {{ alert.device }}</h3>
              <span :class="['status-badge', alert.status]">
                {{ alert.status }}
              </span>
            </div>
            
            <p class="alert-message">{{ alert.message }}</p>
            
            <div class="alert-footer">
              <span class="timestamp">
                {{ new Date(alert.timestamp).toLocaleString() }}
              </span>
              
              <div class="alert-actions">
                <button 
                  v-if="alert.status === 'unresolved'"
                  class="action-btn acknowledge"
                  @click="updateAlertStatus(alert.id, 'acknowledged')"
                >
                  Acknowledge
                </button>
                <button 
                  v-if="['unresolved', 'acknowledged'].includes(alert.status)"
                  class="action-btn resolve"
                  @click="updateAlertStatus(alert.id, 'resolved')"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.alert-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  flex: 1;
}

.search-box input {
  border: none;
  outline: none;
  padding: 0.25rem;
  width: 100%;
  margin-left: 0.5rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card {
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid transparent;
}

.alert-card.critical {
  border-left-color: #dc2626;
}

.alert-card.warning {
  border-left-color: #d97706;
}

.alert-card.info {
  border-left-color: #3b82f6;
}

.alert-icon {
  color: #6b7280;
}

.alert-content {
  flex: 1;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.alert-header h3 {
  margin: 0;
  font-size: 1rem;
}

.alert-message {
  color: #4b5563;
  margin: 0.5rem 0;
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.timestamp {
  color: #6b7280;
  font-size: 0.875rem;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.action-btn.acknowledge {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.resolve {
  background: #047857;
  color: white;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-badge.unresolved {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.acknowledged {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.resolved {
  background: #dcfce7;
  color: #16a34a;
}

@media (max-width: 768px) {
  .alert-filters {
    flex-direction: column;
  }
  
  .alert-card {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .alert-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
