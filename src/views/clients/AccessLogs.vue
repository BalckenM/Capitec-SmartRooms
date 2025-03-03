<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const logs = ref([
  {
    id: 1,
    userId: 'USR001',
    userName: 'John Smith',
    organization: 'Corporate Holdings Group',
    action: 'login',
    resource: 'Admin Portal',
    status: 'success',
    ipAddress: '196.25.255.123',
    userAgent: 'Chrome/120.0.0.0',
    timestamp: '2024-03-02T10:30:00Z',
    details: 'Successful login from Johannesburg office'
  },
  {
    id: 2,
    userId: 'USR002',
    userName: 'Sarah Johnson',
    organization: 'Tech Innovators SA',
    action: 'modify_booking',
    resource: 'Executive Suite',
    status: 'success',
    ipAddress: '196.25.255.124',
    userAgent: 'Safari/17.2',
    timestamp: '2024-03-02T10:15:00Z',
    details: 'Modified booking #1234 schedule'
  },
  {
    id: 3,
    userId: 'USR003',
    userName: 'David Nkosi',
    organization: 'Tech Innovators SA',
    action: 'access_denied',
    resource: 'Smart Controls',
    status: 'failed',
    ipAddress: '196.25.255.125',
    userAgent: 'Firefox/122.0',
    timestamp: '2024-03-02T10:00:00Z',
    details: 'Insufficient permissions for smart controls access'
  }
])

const filterAction = ref('all')
const filterStatus = ref('all')
const searchQuery = ref('')
const dateRange = ref({
  start: '',
  end: ''
})

const { showToast } = useToast()

const fetchLogs = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load access logs', 'error')
  } finally {
    loading.value = false
  }
}

const exportLogs = () => {
  showToast('Exporting logs...', 'info')
  // TODO: Implement export functionality
}

const getStatusColor = (status) => {
  return {
    success: '#16a34a',
    failed: '#dc2626',
    warning: '#d97706'
  }[status] || '#6b7280'
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="access-logs-view">
    <LoadingSpinner :loading="loading" message="Loading access logs..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchLogs">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Access Logs</h1>
        <button class="export-btn" @click="exportLogs">
          <span class="material-icons">download</span>
          Export Logs
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search logs..."
          >
        </div>
        
        <div class="filter-group">
          <select v-model="filterAction">
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="modify_booking">Modify Booking</option>
            <option value="access_denied">Access Denied</option>
          </select>
          
          <select v-model="filterStatus">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="warning">Warning</option>
          </select>
        </div>
        
        <div class="date-filters">
          <input 
            type="date" 
            v-model="dateRange.start"
            placeholder="Start Date"
          >
          <span>to</span>
          <input 
            type="date" 
            v-model="dateRange.end"
            placeholder="End Date"
          >
        </div>
      </div>

      <div class="logs-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Organization</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
              <td>
                <div class="user-info">
                  <span>{{ log.userName }}</span>
                  <span class="user-id">{{ log.userId }}</span>
                </div>
              </td>
              <td>{{ log.organization }}</td>
              <td>
                <span class="action-tag">{{ log.action }}</span>
              </td>
              <td>{{ log.resource }}</td>
              <td>
                <span 
                  class="status-indicator"
                  :style="{ background: getStatusColor(log.status) }"
                ></span>
                {{ log.status }}
              </td>
              <td>
                <div class="ip-info">
                  <span>{{ log.ipAddress }}</span>
                  <span class="user-agent">{{ log.userAgent }}</span>
                </div>
              </td>
              <td>{{ log.details }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.access-logs-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.filters {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.date-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logs-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 500;
  color: #374151;
}

.user-info, .ip-info {
  display: flex;
  flex-direction: column;
}

.user-id, .user-agent {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-tag {
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .filters {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
  
  .date-filters {
    flex-wrap: wrap;
  }
  
  .logs-table {
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .logs-table {
    overflow-x: auto;
  }
  
  table {
    min-width: 1000px;
  }
}
</style>
