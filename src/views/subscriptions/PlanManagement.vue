<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const selectedPlan = ref(null)

const plans = ref([
  {
    id: 1,
    name: 'Basic',
    description: 'For small businesses',
    pricing: {
      monthly: 499,
      quarterly: 1399,
      annual: 4999
    },
    features: [
      'Up to 2 Boardrooms',
      'Basic Smart Controls',
      'Email Support',
      '5GB Storage'
    ],
    active: true
  },
  {
    id: 2,
    name: 'Professional',
    description: 'For growing teams',
    pricing: {
      monthly: 999,
      quarterly: 2799,
      annual: 9999
    },
    features: [
      'Up to 5 Boardrooms',
      'Advanced Smart Controls',
      'Priority Support',
      '20GB Storage',
      'Analytics Dashboard'
    ],
    active: true
  },
  {
    id: 3,
    name: 'Enterprise',
    description: 'For large organizations',
    pricing: {
      monthly: 2499,
      quarterly: 6999,
      annual: 24999
    },
    features: [
      'Unlimited Boardrooms',
      'Full Smart Controls Suite',
      '24/7 Support',
      'Unlimited Storage',
      'Advanced Analytics',
      'Custom Integration'
    ],
    active: true
  }
])

const { showToast } = useToast()

const fetchPlans = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load plans', 'error')
  } finally {
    loading.value = false
  }
}

const savePlan = async (plan) => {
  try {
    await api.put(`/plans/${plan.id}`, plan)
    showToast('Plan updated successfully', 'success')
  } catch (err) {
    showToast('Failed to update plan', 'error')
  }
}

const deletePlan = async (plan) => {
  try {
    await api.delete(`/plans/${plan.id}`)
    plans.value = plans.value.filter(p => p.id !== plan.id)
    showToast('Plan deleted successfully', 'success')
  } catch (err) {
    showToast('Failed to delete plan', 'error')
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<template>
  <div class="plan-management">
    <LoadingSpinner :loading="loading" message="Loading plans..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchPlans">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Subscription Plans</h1>
        <button class="add-btn">
          <span class="material-icons">add</span>
          Create New Plan
        </button>
      </div>

      <div class="plans-grid">
        <div v-for="plan in plans" 
             :key="plan.id" 
             class="plan-card"
        >
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="toggle">
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="plan.active"
                  @change="savePlan(plan)"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <p class="description">{{ plan.description }}</p>

          <div class="pricing-section">
            <div class="price-item" v-for="(price, period) in plan.pricing" :key="period">
              <span class="period">{{ period }}</span>
              <div class="amount">
                <span class="currency">R</span>
                {{ price }}
              </div>
            </div>
          </div>

          <div class="features-list">
            <div class="feature" v-for="feature in plan.features" :key="feature">
              <span class="material-icons check">check_circle</span>
              {{ feature }}
            </div>
          </div>

          <div class="plan-actions">
            <button class="action-btn edit">
              <span class="material-icons">edit</span>
              Edit Plan
            </button>
            <button class="action-btn delete" @click="selectedPlan = plan; showDeleteModal = true">
              <span class="material-icons">delete</span>
              Delete Plan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Delete Plan</h3>
        <p>Are you sure you want to delete the {{ selectedPlan?.name }} plan?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false">Cancel</button>
          <button 
            class="delete"
            @click="deletePlan(selectedPlan); showDeleteModal = false"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plan-management {
  padding: 1rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  align-items: center;
  margin-bottom: 1rem;
}

.plan-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.pricing-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 8px;
}

.price-item {
  text-align: center;
}

.period {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: capitalize;
  margin-bottom: 0.25rem;
}

.amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.currency {
  font-size: 0.875rem;
  margin-right: 0.25rem;
}

.features-list {
  margin-bottom: 1.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.feature .check {
  color: var(--success-color);
  font-size: 1.25rem;
}

.plan-actions {
  display: flex;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
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
}

.action-btn.edit {
  background: var(--bg-light);
  color: var(--text-primary);
}

.action-btn.delete {
  background: #fee2e2;
  color: var(--error-color);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button.delete {
  background: var(--error-color);
  color: white;
}

@media (max-width: 768px) {
  .pricing-section {
    grid-template-columns: 1fr;
  }
  
  .plan-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
