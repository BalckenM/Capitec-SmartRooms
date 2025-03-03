<script setup>
import { ref, computed } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const organizations = ref([
  {
    id: 1,
    name: 'Corporate Holdings Group',
    type: 'Enterprise',
    branches: [
      { name: 'Johannesburg HQ', address: '123 Main Street, Sandton', users: 50 },
      { name: 'Cape Town Branch', address: '456 Beach Road, Sea Point', users: 25 },
      { name: 'Durban Office', address: '789 Marine Drive, Umhlanga', users: 30 }
    ],
    totalUsers: 105,
    adminContact: {
      name: 'Michael van der Merwe',
      email: 'michael@chgroup.co.za',
      phone: '+27 82 123 4567'
    },
    status: 'active',
    features: ['Multi-Branch', 'Custom Branding', 'API Access']
  },
  {
    id: 2,
    name: 'Tech Innovators SA',
    type: 'Professional',
    branches: [
      { name: 'Pretoria Office', address: '321 Innovation Hub, Pretoria', users: 35 }
    ],
    totalUsers: 35,
    adminContact: {
      name: 'Sarah Nkosi',
      email: 'sarah@techinnovators.co.za',
      phone: '+27 83 765 4321'
    },
    status: 'active',
    features: ['Basic Branding', 'Standard Support']
  }
])

const showAddModal = ref(false)
const { showToast } = useToast()

const fetchOrganizations = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load organizations', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<template>
  <div class="organizations-view">
    <LoadingSpinner :loading="loading" message="Loading organizations..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchOrganizations">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Organizations</h1>
        <button class="add-btn" @click="showAddModal = true">
          <span class="material-icons">add</span>
          Add Organization
        </button>
      </div>

      <div class="organizations-grid">
        <div v-for="org in organizations" 
             :key="org.id" 
             class="org-card"
        >
          <div class="org-header">
            <div class="org-title">
              <h3>{{ org.name }}</h3>
              <span class="type-badge">{{ org.type }}</span>
            </div>
            <span :class="['status-badge', org.status]">
              {{ org.status }}
            </span>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="material-icons">business</span>
              <div class="stat-info">
                <span class="stat-label">Branches</span>
                <span class="stat-value">{{ org.branches.length }}</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="material-icons">group</span>
              <div class="stat-info">
                <span class="stat-label">Total Users</span>
                <span class="stat-value">{{ org.totalUsers }}</span>
              </div>
            </div>
          </div>

          <div class="admin-contact">
            <h4>Admin Contact</h4>
            <div class="contact-details">
              <p>{{ org.adminContact.name }}</p>
              <p>{{ org.adminContact.email }}</p>
              <p>{{ org.adminContact.phone }}</p>
            </div>
          </div>

          <div class="features-list">
            <span v-for="feature in org.features" 
                  :key="feature"
                  class="feature-tag"
            >
              {{ feature }}
            </span>
          </div>

          <div class="org-actions">
            <button class="action-btn primary">
              <span class="material-icons">settings</span>
              Manage
            </button>
            <button class="action-btn">
              <span class="material-icons">people</span>
              Users
            </button>
            <button class="action-btn">
              <span class="material-icons">analytics</span>
              Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.organizations-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.organizations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.org-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.org-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.type-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 1rem;
  margin-top: 0.5rem;
  display: inline-block;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.admin-contact {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.admin-contact h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.contact-details p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.feature-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 1rem;
}

.org-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  background: #f3f4f6;
  color: #374151;
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
}

.action-btn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .organizations-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .org-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
