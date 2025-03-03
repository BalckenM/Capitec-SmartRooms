<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const backupInProgress = ref(false)
const restoreInProgress = ref(false)

const backupSettings = ref({
  autoBackup: true,
  frequency: 'daily',
  retention: 30,
  includeData: {
    users: true,
    bookings: true,
    settings: true,
    analytics: true
  },
  storageLocation: 'cloud',
  lastBackup: '2024-03-01T08:00:00Z',
  nextBackup: '2024-03-02T08:00:00Z'
})

const backupHistory = ref([
  {
    id: 1,
    timestamp: '2024-03-01T08:00:00Z',
    size: '156MB',
    type: 'auto',
    status: 'success',
    location: 'cloud'
  },
  {
    id: 2,
    timestamp: '2024-02-29T08:00:00Z',
    size: '152MB',
    type: 'auto',
    status: 'success',
    location: 'cloud'
  },
  {
    id: 3,
    timestamp: '2024-02-28T14:30:00Z',
    size: '155MB',
    type: 'manual',
    status: 'success',
    location: 'local'
  }
])

const { showToast } = useToast()

const fetchBackupSettings = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load backup settings', 'error')
  } finally {
    loading.value = false
  }
}

const saveBackupSettings = async () => {
  try {
    await api.put('/settings/backup', backupSettings.value)
    showToast('Backup settings saved successfully', 'success')
  } catch (err) {
    showToast('Failed to save backup settings', 'error')
  }
}

const initiateBackup = async () => {
  try {
    backupInProgress.value = true
    await api.post('/settings/backup/create')
    showToast('Backup completed successfully', 'success')
    await fetchBackupSettings() // Refresh backup history
  } catch (err) {
    showToast('Backup failed', 'error')
  } finally {
    backupInProgress.value = false
  }
}

const restoreBackup = async (backupId) => {
  if (!confirm('Are you sure you want to restore this backup? Current data will be overwritten.')) {
    return
  }

  try {
    restoreInProgress.value = true
    await api.post(`/settings/backup/restore/${backupId}`)
    showToast('System restored successfully', 'success')
  } catch (err) {
    showToast('Restore failed', 'error')
  } finally {
    restoreInProgress.value = false
  }
}

const downloadBackup = async (backupId) => {
  try {
    const response = await api.get(`/settings/backup/download/${backupId}`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `backup-${backupId}.zip`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    showToast('Failed to download backup', 'error')
  }
}

onMounted(() => {
  fetchBackupSettings()
})
</script>

<template>
  <div class="backup-view">
    <LoadingSpinner :loading="loading" message="Loading backup settings..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchBackupSettings">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Backup & Restore</h1>
        <button 
          class="backup-btn"
          @click="initiateBackup"
          :disabled="backupInProgress"
        >
          <span class="material-icons">backup</span>
          {{ backupInProgress ? 'Backing up...' : 'Create Backup' }}
        </button>
      </div>

      <div class="settings-grid">
        <!-- Backup Settings -->
        <section class="settings-card">
          <h2>Backup Settings</h2>
          <div class="form-group">
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="backupSettings.autoBackup"
                @change="saveBackupSettings"
              >
              Enable Automatic Backups
            </label>
          </div>

          <div v-if="backupSettings.autoBackup">
            <div class="form-group">
              <label>Backup Frequency</label>
              <select 
                v-model="backupSettings.frequency"
                @change="saveBackupSettings"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div class="form-group">
              <label>Retention Period (days)</label>
              <input 
                type="number"
                v-model="backupSettings.retention"
                min="1"
                @change="saveBackupSettings"
              >
            </div>
          </div>

          <h3>Include in Backup</h3>
          <div class="backup-items">
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="backupSettings.includeData.users"
                @change="saveBackupSettings"
              >
              User Data
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="backupSettings.includeData.bookings"
                @change="saveBackupSettings"
              >
              Booking History
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="backupSettings.includeData.settings"
                @change="saveBackupSettings"
              >
              System Settings
            </label>
            <label class="toggle-label">
              <input 
                type="checkbox"
                v-model="backupSettings.includeData.analytics"
                @change="saveBackupSettings"
              >
              Analytics Data
            </label>
          </div>
        </section>

        <!-- Backup History -->
        <section class="settings-card">
          <h2>Backup History</h2>
          <div class="backup-info">
            <div class="info-item">
              <span class="label">Last Backup:</span>
              <span>{{ new Date(backupSettings.lastBackup).toLocaleString() }}</span>
            </div>
            <div class="info-item">
              <span class="label">Next Backup:</span>
              <span>{{ new Date(backupSettings.nextBackup).toLocaleString() }}</span>
            </div>
          </div>

          <div class="backup-list">
            <div 
              v-for="backup in backupHistory" 
              :key="backup.id" 
              class="backup-item"
            >
              <div class="backup-details">
                <div class="backup-primary">
                  <span class="timestamp">
                    {{ new Date(backup.timestamp).toLocaleString() }}
                  </span>
                  <span :class="['status-badge', backup.status]">
                    {{ backup.status }}
                  </span>
                </div>
                <div class="backup-secondary">
                  <span>{{ backup.size }}</span>
                  <span>{{ backup.type }}</span>
                  <span>{{ backup.location }}</span>
                </div>
              </div>
              <div class="backup-actions">
                <button 
                  class="icon-btn"
                  @click="downloadBackup(backup.id)"
                  title="Download Backup"
                >
                  <span class="material-icons">download</span>
                </button>
                <button 
                  class="icon-btn warning"
                  @click="restoreBackup(backup.id)"
                  :disabled="restoreInProgress"
                  title="Restore from Backup"
                >
                  <span class="material-icons">restore</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backup-view {
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

.backup-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.backup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.backup-items {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0;
}

.backup-info {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 4px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.backup-list {
  display: grid;
  gap: 1rem;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 4px;
}

.backup-primary {
  margin-bottom: 0.25rem;
}

.backup-secondary {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-badge.success {
  background: #dcfce7;
  color: var(--success-color);
}

.status-badge.failed {
  background: #fee2e2;
  color: var(--error-color);
}

.backup-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}

.icon-btn:hover {
  background: var(--bg-light);
  color: var(--primary-color);
}

.icon-btn.warning:hover {
  color: var(--warning-color);
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .backup-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .backup-actions {
    justify-content: flex-end;
  }
}
</style>
