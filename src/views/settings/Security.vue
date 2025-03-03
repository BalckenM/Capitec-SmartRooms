<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const saving = ref(false)

const securitySettings = ref({
  authentication: {
    requireMFA: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5
  },
  access: {
    ipWhitelist: ['196.25.255.0/24'],
    allowedTimeWindows: [
      { start: '07:00', end: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    ],
    deviceRestrictions: {
      mobileAccess: true,
      desktopAccess: true,
      tabletAccess: true
    }
  },
  audit: {
    enableAuditLog: true,
    retentionDays: 90,
    loggedEvents: [
      'login',
      'logout',
      'settings_change',
      'access_control',
      'system_events'
    ]
  }
})

const { showToast } = useToast()

const fetchSecuritySettings = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load security settings', 'error')
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  try {
    saving.value = true
    await api.put('/settings/security', securitySettings.value)
    showToast('Security settings saved successfully', 'success')
  } catch (err) {
    showToast('Failed to save security settings', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSecuritySettings()
})
</script>

<template>
  <div class="security-view">
    <LoadingSpinner :loading="loading" message="Loading security settings..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchSecuritySettings">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Security Settings</h1>
        <button 
          class="save-btn" 
          @click="saveSettings"
          :disabled="saving"
        >
          <span class="material-icons">save</span>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <div class="settings-grid">
        <!-- Authentication Settings -->
        <section class="settings-card">
          <h2>Authentication</h2>
          <div class="form-group">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                v-model="securitySettings.authentication.requireMFA"
              >
              Require Multi-Factor Authentication
            </label>
          </div>
          
          <h3>Password Policy</h3>
          <div class="form-group">
            <label>Minimum Length</label>
            <input 
              type="number" 
              v-model="securitySettings.authentication.passwordPolicy.minLength"
              min="8"
              max="32"
            >
          </div>
          <div class="toggle-group">
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.authentication.passwordPolicy.requireUppercase"
              >
              Require Uppercase Letters
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.authentication.passwordPolicy.requireNumbers"
              >
              Require Numbers
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.authentication.passwordPolicy.requireSpecialChars"
              >
              Require Special Characters
            </label>
          </div>
          <div class="form-group">
            <label>Password Expiry (days)</label>
            <input 
              type="number"
              v-model="securitySettings.authentication.passwordPolicy.expiryDays"
              min="0"
              step="30"
            >
          </div>
        </section>

        <!-- Access Control -->
        <section class="settings-card">
          <h2>Access Control</h2>
          <div class="form-group">
            <label>IP Whitelist (CIDR)</label>
            <div v-for="(ip, index) in securitySettings.access.ipWhitelist" 
                 :key="index" 
                 class="ip-entry"
            >
              <input type="text" v-model="securitySettings.access.ipWhitelist[index]">
              <button class="icon-btn" @click="securitySettings.access.ipWhitelist.splice(index, 1)">
                <span class="material-icons">delete</span>
              </button>
            </div>
            <button 
              class="add-btn"
              @click="securitySettings.access.ipWhitelist.push('')"
            >
              Add IP Range
            </button>
          </div>

          <h3>Device Access</h3>
          <div class="toggle-group">
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.access.deviceRestrictions.desktopAccess"
              >
              Allow Desktop Access
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.access.deviceRestrictions.mobileAccess"
              >
              Allow Mobile Access
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.access.deviceRestrictions.tabletAccess"
              >
              Allow Tablet Access
            </label>
          </div>
        </section>

        <!-- Audit Settings -->
        <section class="settings-card">
          <h2>Audit Log</h2>
          <div class="form-group">
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="securitySettings.audit.enableAuditLog"
              >
              Enable Audit Logging
            </label>
          </div>
          <div class="form-group">
            <label>Log Retention (days)</label>
            <input 
              type="number"
              v-model="securitySettings.audit.retentionDays"
              min="30"
              step="30"
            >
          </div>
          <h3>Events to Log</h3>
          <div class="event-list">
            <label 
              v-for="event in ['login', 'logout', 'settings_change', 'access_control', 'system_events']"
              :key="event"
              class="event-item"
            >
              <input 
                type="checkbox"
                v-model="securitySettings.audit.loggedEvents"
                :value="event"
              >
              {{ event.replace('_', ' ').charAt(0).toUpperCase() + event.slice(1).replace('_', ' ') }}
            </label>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.security-view {
  padding: 1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.settings-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.settings-card h3 {
  margin: 1.5rem 0 1rem;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1rem;
}

.toggle-group {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.ip-entry {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.icon-btn {
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
}

.add-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-primary);
}

.event-list {
  display: grid;
  gap: 0.5rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
