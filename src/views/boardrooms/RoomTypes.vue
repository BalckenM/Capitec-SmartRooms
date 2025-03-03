<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const loading = ref(true)
const roomTypes = ref([
  {
    id: 1,
    name: 'Executive Suite',
    description: 'Premium boardroom with high-end AV equipment',
    capacity: '15-20',
    features: ['4K Displays', 'Video Conferencing', 'Smart Controls'],
    rate: 200
  },
  {
    id: 2,
    name: 'Standard Meeting Room',
    description: 'Standard meeting room for regular meetings',
    capacity: '8-12',
    features: ['HD Display', 'Whiteboard', 'Basic AV'],
    rate: 100
  },
  {
    id: 3,
    name: 'Huddle Room',
    description: 'Small room for quick meetings',
    capacity: '4-6',
    features: ['Display Screen', 'Video Call Setup'],
    rate: 50
  }
])

const showAddModal = ref(false)
const newRoomType = ref({
  name: '',
  description: '',
  capacity: '',
  features: [],
  rate: 0
})

onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    loading.value = false
  }
})

const addRoomType = () => {
  showAddModal.value = true
}

const saveRoomType = () => {
  roomTypes.value.push({
    id: Date.now(),
    ...newRoomType.value
  })
  showAddModal.value = false
  newRoomType.value = {
    name: '',
    description: '',
    capacity: '',
    features: [],
    rate: 0
  }
}
</script>

<template>
  <div class="room-types">
    <LoadingSpinner :loading="loading" message="Loading room types..." />
    
    <div v-if="!loading" class="content">
      <div class="page-header">
        <h1>Room Types</h1>
        <button class="add-btn" @click="addRoomType">
          <span class="material-icons">add</span>
          Add Room Type
        </button>
      </div>

      <div class="types-grid">
        <div v-for="type in roomTypes" 
             :key="type.id" 
             class="type-card"
        >
          <div class="type-header">
            <h3>{{ type.name }}</h3>
            <div class="rate">${{ type.rate }}/hour</div>
          </div>
          
          <p class="description">{{ type.description }}</p>
          
          <div class="capacity">
            <span class="material-icons">group</span>
            {{ type.capacity }} people
          </div>
          
          <div class="features">
            <div v-for="feature in type.features" 
                 :key="feature" 
                 class="feature-tag"
            >
              {{ feature }}
            </div>
          </div>
          
          <div class="card-actions">
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

    <!-- Add Room Type Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>Add Room Type</h2>
        <form @submit.prevent="saveRoomType">
          <div class="form-group">
            <label>Name</label>
            <input v-model="newRoomType.name" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newRoomType.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Capacity</label>
            <input v-model="newRoomType.capacity" required>
          </div>
          <div class="form-group">
            <label>Rate ($/hour)</label>
            <input type="number" v-model="newRoomType.rate" required>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showAddModal = false">Cancel</button>
            <button type="submit" class="primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-types {
  position: relative;
  min-height: 200px;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.type-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.rate {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.description {
  color: #666;
  margin-bottom: 1rem;
}

.capacity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button.primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .types-grid {
    grid-template-columns: 1fr;
  }
}
</style>
