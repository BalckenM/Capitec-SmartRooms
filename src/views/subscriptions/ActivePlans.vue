<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const activePlans = ref([
  {
    id: 1,
    clientName: 'Corporate Holdings Group',
    planName: 'Enterprise',
    startDate: '2024-01-01',
    nextBilling: '2024-04-01',
    amount: 2999,
    billingCycle: 'quarterly',
    status: 'active',
    features: [
      'Unlimited Boardrooms',
      'Smart Controls',
      'Advanced Analytics',
      'Priority Support'
    ],
    usage: {
      boardrooms: 12,
      activeUsers: 150,
      bookings: 450
    }
  },
  {
    id: 2,
    clientName: 'Tech Innovators SA',
    planName: 'Professional',
    startDate: '2024-02-01',
    nextBilling: '2024-03-01',
    amount: 799,
    billingCycle: 'monthly',
    status: 'active',
    features: [
      'Up to 5 Boardrooms',
      'Basic Controls',
      'Standard Support'
    ],
    usage: {
      boardrooms: 4,
      activeUsers: 35,
      bookings: 120
    }
  }
])

const filterStatus = ref('all')
const searchQuery = ref('')
const { showToast } = useToast()

const fetchActivePlans = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load active plans', 'error')
  } finally {
    loading.value = false
  }
}

const filteredPlans = computed(() => {
  return activePlans.value.filter(plan => {
    const matchesSearch = plan.clientName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === 'all' || plan.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

onMounted(() => {
  fetchActivePlans()
})
</script>

<template>
  <div class="active-plans-view">
    <LoadingSpinner :loading="loading" message="Loading active plans..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchActivePlans">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Active Subscription Plans</h1>
        <div class="header-actions">
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
            <option value="expiring">Expiring Soon</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div class="plans-grid">
        <div v-for="plan in filteredPlans" 
             :key="plan.id" 
             class="plan-card"
        >
          <div class="plan-header">
            <div class="client-info">
              <h3>{{ plan.clientName }}</h3>
              <span class="plan-name">{{ plan.planName }} Plan</span>
            </div>
            <span :class="['status-badge', plan.status]">
              {{ plan.status }}
            </span>
          </div>

          <div class="billing-info">
            <div class="amount">
              <span class="currency">R</span>
              <span class="value">{{ plan.amount }}</span>
              <span class="cycle">/{{ plan.billingCycle }}</span>
            </div>
            <div class="dates">
              <div class="date-item">
                <span class="label">Start Date:</span>
                <span>{{ plan.startDate }}</span>
              </div>
              <div class="date-item">
                <span class="label">Next Billing:</span>
                <span>{{ plan.nextBilling }}</span>
              </div>
            </div>
          </div>

          <div class="usage-stats">
            <div class="stat-item">
              <span class="material-icons">meeting_room</span>
              <div class="stat-info">
                <span class="stat-label">Boardrooms</span>
                <span class="stat-value">{{ plan.usage.boardrooms }}</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="material-icons">group</span>
              <div class="stat-info">
                <span class="stat-label">Active Users</span>
                <span class="stat-value">{{ plan.usage.activeUsers }}</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="material-icons">calendar_today</span>
              <div class="stat-info">
                <span class="stat-label">Bookings</span>
                <span class="stat-value">{{ plan.usage.bookings }}</span>
              </div>
            </div>
          </div>

          <div class="features-list">
            <span v-for="feature in plan.features" 
                  :key="feature"
                  class="feature-tag"
            >
              {{ feature }}
            </span>
          </div>

          <div class="plan-actions">
            <button class="action-btn">
              <span class="material-icons">edit</span>
              Modify Plan
            </button>
            <button class="action-btn">
              <span class="material-icons">receipt_long</span>
              Billing History
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active-plans-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  flex: 1;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  margin-left: 0.5rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.plan-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.plan-name {
  color: #6b7280;
  font-size: 0.875rem;
}

.billing-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 1.25rem;
  margin-right: 0.25rem;
}

.value {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
}

.cycle {
  color: #6b7280;
  margin-left: 0.25rem;
}

.usage-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  font-weight: 600;
  color: #1f2937;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.feature-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 1rem;
}

.plan-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: #e5e7eb;
}

@media (max-width: 1024px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .usage-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
  }
  
  .plan-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .billing-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
