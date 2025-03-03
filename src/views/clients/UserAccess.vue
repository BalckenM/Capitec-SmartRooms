<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const users = ref([
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@chgroup.co.za',
    role: 'Organization Admin',
    organization: 'Corporate Holdings Group',
    permissions: ['manage_users', 'manage_bookings', 'view_reports'],
    lastAccess: '2024-03-02T10:30:00Z',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@techinnovators.co.za',
    role: 'Booking Manager',
    organization: 'Tech Innovators SA',
    permissions: ['manage_bookings', 'view_reports'],
    lastAccess: '2024-03-02T09:15:00Z',
    status: 'active'
  }
])

const roles = ref([
  { 
    name: 'Organization Admin',
    permissions: ['manage_users', 'manage_bookings', 'view_reports', 'manage_billing']
  },
  {
    name: 'Booking Manager',
    permissions: ['manage_bookings', 'view_reports']
  },
  {
    name: 'User',
    permissions: ['book_rooms', 'view_schedule']
  }
])

const showAddModal = ref(false)
const showPermissionsModal = ref(false)
const selectedUser = ref(null)
const { showToast } = useToast()

const fetchUsers = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load users', 'error')
  } finally {
    loading.value = false
  }
}

const updateUserRole = async (userId, newRole) => {
  try {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.role = newRole
      // Update permissions based on role
      user.permissions = roles.value.find(r => r.name === newRole).permissions
      showToast('User role updated successfully', 'success')
    }
  } catch (err) {
    showToast('Failed to update user role', 'error')
  }
}

const toggleUserStatus = async (userId) => {
  try {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active'
      showToast(`User ${user.status === 'active' ? 'activated' : 'deactivated'}`, 'success')
    }
  } catch (err) {
    showToast('Failed to update user status', 'error')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="user-access-view">
    <LoadingSpinner :loading="loading" message="Loading users..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchUsers">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>User Access Management</h1>
        <div class="header-actions">
          <button class="action-btn">
            <span class="material-icons">build</span>
            Manage Roles
          </button>
          <button class="add-btn" @click="showAddModal = true">
            <span class="material-icons">person_add</span>
            Add User
          </button>
        </div>
      </div>

      <div class="users-list">
        <div v-for="user in users" 
             :key="user.id" 
             class="user-card"
        >
          <div class="user-info">
            <div class="user-header">
              <span class="material-icons avatar">account_circle</span>
              <div class="user-details">
                <h3>{{ user.name }}</h3>
                <span class="email">{{ user.email }}</span>
              </div>
              <span :class="['status-badge', user.status]">
                {{ user.status }}
              </span>
            </div>

            <div class="role-section">
              <div class="role-header">
                <span class="label">Role:</span>
                <select 
                  v-model="user.role"
                  @change="updateUserRole(user.id, $event.target.value)"
                >
                  <option v-for="role in roles" :key="role.name" :value="role.name">
                    {{ role.name }}
                  </option>
                </select>
              </div>
              
              <div class="permissions">
                <span class="label">Permissions:</span>
                <div class="permission-tags">
                  <span 
                    v-for="permission in user.permissions" 
                    :key="permission"
                    class="permission-tag"
                  >
                    {{ permission }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="user-actions">
            <button class="icon-btn" @click="showPermissionsModal = true; selectedUser = user">
              <span class="material-icons">security</span>
              <span>Permissions</span>
            </button>
            <button class="icon-btn" @click="toggleUserStatus(user.id)">
              <span class="material-icons">
                {{ user.status === 'active' ? 'block' : 'check_circle' }}
              </span>
              <span>{{ user.status === 'active' ? 'Deactivate' : 'Activate' }}</span>
            </button>
            <button class="icon-btn">
              <span class="material-icons">history</span>
              <span>Access Logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-access-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.users-list {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.user-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  font-size: 2.5rem;
  color: #6b7280;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  margin: 0;
  font-size: 1.1rem;
}

.email {
  color: #6b7280;
  font-size: 0.875rem;
}

.role-section {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin: 1rem 0;
}

.role-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.label {
  font-weight: 500;
  color: #374151;
}

select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
}

.permissions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.permission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 1rem;
}

.user-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
}

.icon-btn:hover {
  background: #e5e7eb;
}

.status-badge {
  padding: 0.25rem 0.75rem;
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
  background: #fee2e2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
  }
  
  .user-actions {
    flex-direction: column;
  }
  
  .icon-btn {
    width: 100%;
    justify-content: center;
  }
  
  .role-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
