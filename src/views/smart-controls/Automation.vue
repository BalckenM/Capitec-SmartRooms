<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const automationRules = ref([
  {
    id: 1,
    name: 'Morning Startup',
    room: 'Executive Suite',
    trigger: 'schedule',
    schedule: '08:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    actions: [
      { device: 'Lights', action: 'turn_on', value: '80%' },
      { device: 'AC', action: 'set_temperature', value: '22°C' },
      { device: 'Blinds', action: 'open' }
    ],
    status: 'active'
  },
  {
    id: 2,
    name: 'Meeting Mode',
    room: 'Innovation Lab',
    trigger: 'occupancy',
    conditions: [
      { sensor: 'Motion', condition: 'detected' }
    ],
    actions: [
      { device: 'Projector', action: 'turn_on' },
      { device: 'Lights', action: 'dim', value: '50%' }
    ],
    status: 'active'
  }
])

const showAddModal = ref(false)
const { showToast } = useToast()

const fetchAutomationRules = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load automation rules', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAutomationRules()
})

const toggleRuleStatus = async (ruleId) => {
  const rule = automationRules.value.find(r => r.id === ruleId)
  if (rule) {
    rule.status = rule.status === 'active' ? 'inactive' : 'active'
    showToast(`Rule ${rule.status === 'active' ? 'activated' : 'deactivated'}`, 'success')
  }
}
</script>

<template>
  <div class="automation-view">
    <LoadingSpinner :loading="loading" message="Loading automation rules..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchAutomationRules">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Room Automation</h1>
        <button class="add-btn" @click="showAddModal = true">
          <span class="material-icons">add</span>
          New Automation Rule
        </button>
      </div>

      <div class="rules-grid">
        <div v-for="rule in automationRules" 
             :key="rule.id" 
             class="rule-card"
        >
          <div class="rule-header">
            <div class="rule-title">
              <h3>{{ rule.name }}</h3>
              <span class="room-badge">{{ rule.room }}</span>
            </div>
            <label class="switch">
              <input 
                type="checkbox" 
                :checked="rule.status === 'active'"
                @change="toggleRuleStatus(rule.id)"
              >
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="trigger-info">
            <span class="material-icons">
              {{ rule.trigger === 'schedule' ? 'schedule' : 'sensors' }}
            </span>
            <span>
              {{ rule.trigger === 'schedule' 
                ? `${rule.schedule} on ${rule.days.join(', ')}` 
                : 'On occupancy detection' }}
            </span>
          </div>
          
          <div class="actions-list">
            <div v-for="(action, index) in rule.actions" 
                 :key="index"
                 class="action-item"
            >
              <span class="material-icons">{{ action.device.toLowerCase() }}</span>
              <span>{{ action.device }}: {{ action.action }} {{ action.value || '' }}</span>
            </div>
          </div>
          
          <div class="rule-footer">
            <button class="icon-btn" title="Edit Rule">
              <span class="material-icons">edit</span>
            </button>
            <button class="icon-btn" title="Delete Rule">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.automation-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.rule-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.rule-title {
  flex: 1;
}

.rule-title h3 {
  margin: 0 0 0.5rem 0;
}

.room-badge {
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.trigger-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.actions-list {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #374151;
}

.rule-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

@media (max-width: 768px) {
  .rules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
