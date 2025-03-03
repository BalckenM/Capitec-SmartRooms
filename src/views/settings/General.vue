<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const settings = ref({
  company: {
    name: 'MeltsCloud',
    logo: '/images/logo.png',
    timezone: 'Africa/Johannesburg',
    currency: 'ZAR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  },
  bookings: {
    defaultDuration: 60,
    minDuration: 30,
    maxDuration: 240,
    bufferTime: 15,
    workingHours: {
      start: '08:00',
      end: '18:00'
    },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  notifications: {
    email: {
      enabled: true,
      events: ['booking', 'cancellation', 'reminder']
    },
    sms: {
      enabled: false,
      events: ['booking', 'cancellation']
    }
  },
  maintenance: {
    autoSchedule: true,
    checkInterval: 'weekly',
    notifyBeforeDays: 3
  }
})

const { showToast } = useToast()

const saveSettings = async () => {
  try {
    await api.put('/settings', settings.value)
    showToast('Settings saved successfully', 'success')
  } catch (err) {
    showToast('Failed to save settings', 'error')
  }
}

const fetchSettings = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load settings', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<template>
  <div class="settings-view">
    <LoadingSpinner :loading="loading" message="Loading settings..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchSettings">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>General Settings</h1>
        <button class="primary-btn" @click="saveSettings">
          <span class="material-icons">save</span>
          Save Changes
        </button>
      </div>

      <div class="settings-grid">
        <!-- Company Settings -->
        <section class="settings-card">
          <h2>Company Settings</h2>
          <div class="form-group">
            <label>Company Name</label>
            <input v-model="settings.company.name" type="text">
          </div>
          <div class="form-group">
            <label>Time Zone</label>
            <select v-model="settings.company.timezone">
              <option value="Africa/Johannesburg">SAST (Johannesburg)</option>
              <option value="Africa/Cape_Town">SAST (Cape Town)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Currency</label>
            <select v-model="settings.company.currency">
              <option value="ZAR">South African Rand (ZAR)</option>
              <option value="USD">US Dollar (USD)</option>
            </select>
          </div>
        </section>

        <!-- Booking Settings -->
        <section class="settings-card">
          <h2>Booking Defaults</h2>
          <div class="form-group">
            <label>Default Duration (minutes)</label>
            <input type="number" v-model="settings.bookings.defaultDuration" min="30" step="15">
          </div>
          <div class="form-group">
            <label>Buffer Time (minutes)</label>
            <input type="number" v-model="settings.bookings.bufferTime" min="0" step="5">
          </div>
          <div class="time-range">
            <div class="form-group">
              <label>Working Hours</label>
              <div class="flex gap-2">
                <input type="time" v-model="settings.bookings.workingHours.start">
                <span>to</span>
                <input type="time" v-model="settings.bookings.workingHours.end">
              </div>
            </div>
          </div>
        </section>

        <!-- Notification Settings -->
        <section class="settings-card">
          <h2>Notifications</h2>
          <div class="notification-settings">
            <div class="notification-type">
              <div class="flex items-center justify-between">
                <h3>Email Notifications</h3>
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifications.email.enabled">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="notification-events" v-if="settings.notifications.email.enabled">
                <label v-for="event in ['booking', 'cancellation', 'reminder']" :key="event">
                  <input type="checkbox" v-model="settings.notifications.email.events" :value="event">
                  {{ event.charAt(0).toUpperCase() + event.slice(1) }}
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Maintenance Settings -->
        <section class="settings-card">
          <h2>Maintenance</h2>
          <div class="form-group">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="settings.maintenance.autoSchedule">
              Auto-schedule maintenance checks
            </label>
          </div>
          <div class="form-group" v-if="settings.maintenance.autoSchedule">
            <label>Check Interval</label>
            <select v-model="settings.maintenance.checkInterval">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
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

.form-group {
  margin-bottom: 1rem;
}

.notification-type {
  margin-bottom: 1.5rem;
}

.notification-events {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-left: 1rem;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .time-range input {
    width: 100%;
  }
}
</style>
