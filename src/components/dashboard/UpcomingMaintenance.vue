<script setup>
import { ref, onMounted } from 'vue'

const maintenanceTasks = ref([
  { id: 1, room: 'Conference Room A', task: 'AC Maintenance', date: '2024-01-25', priority: 'high' },
  { id: 2, room: 'Meeting Room B', task: 'Projector Check', date: '2024-01-26', priority: 'medium' },
  { id: 3, room: 'Executive Suite', task: 'Deep Cleaning', date: '2024-01-27', priority: 'low' }
])
</script>

<template>
  <div class="maintenance">
    <h3 class="section-title">Upcoming Maintenance</h3>
    <div class="maintenance-grid">
      <div v-for="task in maintenanceTasks" 
           :key="task.id" 
           class="maintenance-item"
           :class="`priority-${task.priority}`">
        <div class="task-info">
          <h4>{{ task.room }}</h4>
          <p>{{ task.task }}</p>
        </div>
        <div class="task-meta">
          <span class="date">{{ task.date }}</span>
          <span class="priority">{{ task.priority }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance {
  padding: 1rem;
}

.section-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.maintenance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.maintenance-item {
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  border-left: 4px solid transparent;
}

.priority-high {
  border-left-color: #ef4444;
}

.priority-medium {
  border-left-color: #f59e0b;
}

.priority-low {
  border-left-color: #10b981;
}

.task-info h4 {
  margin: 0;
  font-size: 1rem;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.priority {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
