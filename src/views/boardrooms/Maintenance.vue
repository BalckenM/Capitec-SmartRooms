<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const maintenanceTasks = ref([
  {
    id: 1,
    roomName: 'Executive Suite',
    task: 'AV System Check',
    priority: 'high',
    status: 'pending',
    scheduledDate: '2024-03-15',
    assignedTo: 'Tech Team',
    description: 'Monthly check of all audio-visual equipment'
  },
  {
    id: 2,
    roomName: 'Innovation Lab',
    task: 'Smart Controls Maintenance',
    priority: 'medium',
    status: 'completed',
    scheduledDate: '2024-03-10',
    assignedTo: 'IoT Team',
    description: 'Quarterly maintenance of smart room controls'
  }
])

const showAddModal = ref(false)
const newTask = ref({
  roomName: '',
  task: '',
  priority: 'medium',
  scheduledDate: '',
  assignedTo: '',
  description: ''
})

const { showToast } = useToast()

const fetchTasks = async () => {
  try {
    loading.value = true
    // Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load maintenance tasks', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTasks()
})

const priorityClasses = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low'
}

const statusClasses = {
  pending: 'status-pending',
  'in-progress': 'status-progress',
  completed: 'status-completed'
}
</script>

<template>
  <div class="maintenance-view">
    <LoadingSpinner :loading="loading" message="Loading maintenance tasks..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchTasks">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Maintenance Schedule</h1>
        <button class="add-btn" @click="showAddModal = true">
          <span class="material-icons">add</span>
          Schedule Maintenance
        </button>
      </div>

      <div class="maintenance-grid">
        <div v-for="task in maintenanceTasks" 
             :key="task.id" 
             class="task-card"
        >
          <div class="task-header">
            <h3>{{ task.roomName }}</h3>
            <span :class="['priority-badge', priorityClasses[task.priority]]">
              {{ task.priority }}
            </span>
          </div>
          
          <div class="task-details">
            <h4>{{ task.task }}</h4>
            <p>{{ task.description }}</p>
          </div>
          
          <div class="task-meta">
            <div class="meta-item">
              <span class="material-icons">calendar_today</span>
              {{ task.scheduledDate }}
            </div>
            <div class="meta-item">
              <span class="material-icons">person</span>
              {{ task.assignedTo }}
            </div>
          </div>
          
          <div class="task-footer">
            <span :class="['status-badge', statusClasses[task.status]]">
              {{ task.status }}
            </span>
            <div class="task-actions">
              <button class="icon-btn" title="Edit">
                <span class="material-icons">edit</span>
              </button>
              <button class="icon-btn" title="Delete">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-view {
  padding: 1rem;
  position: relative;
  min-height: 200px;
}

.maintenance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-low {
  background: #e0f2f1;
  color: #0d9488;
}

.task-details {
  margin-bottom: 1rem;
}

.task-details h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.task-details p {
  color: #6b7280;
  font-size: 0.875rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-pending {
  background: #dbeafe;
  color: #2563eb;
}

.status-progress {
  background: #fef3c7;
  color: #d97706;
}

.status-completed {
  background: #dcfce7;
  color: #16a34a;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #6b7280;
}

.icon-btn:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .maintenance-grid {
    grid-template-columns: 1fr;
  }
  
  .task-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
