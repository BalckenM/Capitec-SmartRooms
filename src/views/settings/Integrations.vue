<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'
import { useAuthStore } from '@/stores/auth'

const loading = ref(true)
const error = ref(null)
const integrations = ref([
  {
    id: 'payment-gateways',
    name: 'Payment Gateways',
    items: [
      {
        id: 'payfast',
        name: 'PayFast',
        status: 'active',
        icon: 'payments',
        config: {
          merchantId: '',
          merchantKey: '',
          passphrase: '',
          testMode: true
        }
      },
      {
        id: 'yoco',
        name: 'Yoco',
        status: 'inactive',
        icon: 'credit_card',
        config: {
          apiKey: '',
          testMode: true
        }
      }
    ]
  },
  {
    id: 'communications',
    name: 'Communications',
    items: [
      {
        id: 'twilio',
        name: 'Twilio SMS',
        status: 'inactive',
        icon: 'sms',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: ''
        }
      },
      {
        id: 'sendgrid',
        name: 'SendGrid',
        status: 'active',
        icon: 'email',
        config: {
          apiKey: '',
          fromEmail: '',
          fromName: ''
        }
      }
    ]
  },
  {
    id: 'calendar',
    name: 'Calendar Systems',
    items: [
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        status: 'active',
        icon: 'event',
        config: {
          clientId: '',
          clientSecret: '',
          redirectUri: ''
        }
      },
      {
        id: 'office365',
        name: 'Office 365',
        status: 'inactive',
        icon: 'calendar_today',
        config: {
          clientId: '',
          clientSecret: '',
          tenantId: ''
        }
      }
    ]
  }
])

const selectedIntegration = ref(null)
const showConfigModal = ref(false)
const { showToast } = useToast()

const fetchIntegrations = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load integrations', 'error')
  } finally {
    loading.value = false
  }
}

const toggleIntegration = async (integration) => {
  try {
    integration.status = integration.status === 'active' ? 'inactive' : 'active'
    await api.patch(`/integrations/${integration.id}/status`, {
      status: integration.status
    })
    showToast(`${integration.name} ${integration.status === 'active' ? 'activated' : 'deactivated'}`, 'success')
  } catch (err) {
    showToast('Failed to update integration status', 'error')
  }
}

const configureIntegration = (integration) => {
  selectedIntegration.value = { ...integration }
  showConfigModal.value = true
}

const saveIntegrationConfig = async () => {
  try {
    await api.put(`/integrations/${selectedIntegration.value.id}/config`, {
      config: selectedIntegration.value.config
    })
    showToast('Integration configuration saved', 'success')
    showConfigModal.value = false
  } catch (err) {
    showToast('Failed to save integration configuration', 'error')
  }
}

const authStore = useAuthStore()

// Login
await authStore.login({
  email: 'user@example.com',
  password: 'password',
  remember: true
})

// Check auth
if (authStore.isAuthenticated) {
  // Do authenticated stuff
}

// Check permissions
if (authStore.hasPermission('manage_users')) {
  // Allow user management
}

onMounted(() => {
  fetchIntegrations()
})
</script>

<template>
  <div class="integrations-view">
    <LoadingSpinner :loading="loading" message="Loading integrations..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchIntegrations">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Integrations</h1>
      </div>

      <div class="integrations-grid">
        <section 
          v-for="group in integrations" 
          :key="group.id" 
          class="integration-group"
        >
          <h2>{{ group.name }}</h2>
          <div class="integration-cards">
            <div 
              v-for="integration in group.items" 
              :key="integration.id" 
              class="integration-card"
            >
              <div class="integration-header">
                <div class="integration-info">
                  <span class="material-icons">{{ integration.icon }}</span>
                  <h3>{{ integration.name }}</h3>
                </div>
                <label class="switch">
                  <input 
                    type="checkbox"
                    :checked="integration.status === 'active'"
                    @change="toggleIntegration(integration)"
                  >
                  <span class="slider"></span>
                </label>
              </div>

              <div class="integration-actions">
                <button 
                  class="config-btn"
                  @click="configureIntegration(integration)"
                >
                  <span class="material-icons">settings</span>
                  Configure
                </button>
                <a href="#" class="docs-link">
                  <span class="material-icons">description</span>
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Configuration Modal -->
    <div v-if="showConfigModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Configure {{ selectedIntegration?.name }}</h2>
          <button class="close-btn" @click="showConfigModal = false">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="modal-body">
          <div 
            v-for="(value, key) in selectedIntegration?.config" 
            :key="key"
            class="form-group"
          >
            <label>{{ key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}</label>
            <input 
              v-if="key !== 'testMode'"
              :type="key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') ? 'password' : 'text'"
              v-model="selectedIntegration.config[key]"
              :placeholder="Enter your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}"
            >
            <label v-else class="toggle-label">
              <input 
                type="checkbox"
                v-model="selectedIntegration.config[key]"
              >
              Test Mode
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="showConfigModal = false">Cancel</button>
          <button class="save-btn" @click="saveIntegrationConfig">Save Configuration</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.integrations-view {
  padding: 1rem;
}

.integrations-grid {
  display: grid;
  gap: 2rem;
}

.integration-group h2 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.integration-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.integration-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.integration-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.integration-info h3 {
  margin: 0;
  font-size: 1.1rem;
}

.integration-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.config-btn, .docs-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-decoration: none;
}

.config-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.docs-link {
  background: var(--bg-light);
  color: var(--text-primary);
}

.modal-overlay {
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
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.save-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.cancel-btn {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .integration-cards {
    grid-template-columns: 1fr;
  }
  
  .integration-actions {
    flex-direction: column;
  }
  
  .config-btn, .docs-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
