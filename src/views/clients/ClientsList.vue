<script setup>
import { ref, computed } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const clients = ref([
  {
    id: 1,
    name: 'Tech Solutions Inc',
    contactPerson: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+27 11 123 4567',
    subscription: 'Enterprise',
    activeUsers: 25,
    status: 'active',
    lastLogin: '2024-03-01T08:30:00Z',
    location: 'Johannesburg'
  },
  {
    id: 2,
    name: 'Digital Innovations',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@digitalinno.com',
    phone: '+27 21 987 6543',
    subscription: 'Professional',
    activeUsers: 12,
    status: 'active',
    lastLogin: '2024-03-02T09:15:00Z',
    location: 'Cape Town'
  }
])

const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('name')
const sortDesc = ref(false)

const { showToast } = useToast()

const fetchClients = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load clients', 'error')
  } finally {
    loading.value = false
  }
}

const filteredClients = computed(() => {
  return clients.value
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = filterStatus.value === 'all' || client.status === filterStatus.value
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const modifier = sortDesc.value ? -1 : 1
      return modifier * a[sortBy.value].localeCompare(b[sortBy.value])
    })
})

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = field
    sortDesc.value = false
  }
}

const updateClientStatus = async (clientId, newStatus) => {
  try {
    // TODO: Replace with actual API call
    const client = clients.value.find(c => c.id === clientId)
    if (client) {
      client.status = newStatus
      showToast('Client status updated successfully', 'success')
    }
  } catch (err) {
    showToast('Failed to update client status', 'error')
  }
}
</script>

<template>
  <div class="clients-view">
    <LoadingSpinner :loading="loading" message="Loading clients..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchClients">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Clients</h1>
        <button class="add-btn">
          <span class="material-icons">add</span>
          Add Client
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search clients..."
          >
        </div>
        <select v-model="filterStatus">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div class="clients-table">
        <table>
          <thead>
            <tr>
              <th @click="toggleSort('name')">
                Company Name
                <span class="sort-icon material-icons" v-if="sortBy === 'name'">
                  {{ sortDesc ? 'arrow_downward' : 'arrow_upward' }}
                </span>
              </th>
              <th>Contact Person</th>
              <th>Subscription</th>
              <th>Active Users</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.id">
              <td>
                <div class="company-info">
                  <strong>{{ client.name }}</strong>
                  <span class="email">{{ client.email }}</span>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <span>{{ client.contactPerson }}</span>
                  <span class="phone">{{ client.phone }}</span>
                </div>
              </td>
              <td>{{ client.subscription }}</td>
              <td>{{ client.activeUsers }}</td>
              <td>{{ client.location }}</td>
              <td>
                <span :class="['status-badge', client.status]">
                  {{ client.status }}
                </span>
              </td>
              <td class="actions">
                <button class="icon-btn" title="Edit">
                  <span class="material-icons">edit</span>
                </button>
                <button class="icon-btn" title="Manage Access">
                  <span class="material-icons">admin_panel_settings</span>
                </button>
                <button class="icon-btn" title="View Details">
                  <span class="material-icons">visibility</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clients-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  margin-left: 0.5rem;
}

.clients-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1rem;
  background: #f9fafb;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

td {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.company-info, .contact-info {
  display: flex;
  flex-direction: column;
}

.email, .phone {
  font-size: 0.875rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.suspended {
  background: #fee2e2;
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: var(--primary-color);
}

.sort-icon {
  font-size: 1rem;
  vertical-align: middle;
  margin-left: 0.25rem;
}

@media (max-width: 1024px) {
  .clients-table {
    font-size: 0.875rem;
  }
  
  td, th {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .clients-table {
    overflow-x: auto;
  }
}
</style>
