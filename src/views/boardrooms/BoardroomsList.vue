<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../../services/axios'

const router = useRouter()
const boardrooms = ref([
  {
    id: 1,
    name: 'Executive Suite Alpha',
    capacity: 20,
    status: 'available',
    features: ['4K Video Conferencing', 'Smart Whiteboard', 'Premium Coffee Bar', 'Climate Control'],
    image: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    utilization: 75,
    price: 150,
    floor: '15th Floor',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Innovation Hub Beta',
    capacity: 12,
    status: 'occupied',
    features: ['Interactive Display', 'Surround Sound', 'Ergonomic Furniture', 'Panoramic Views'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    utilization: 85,
    price: 120,
    floor: '12th Floor',
    rating: 4.6
  },
  {
    id: 3,
    name: 'Creative Studio Gamma',
    capacity: 8,
    status: 'available',
    features: ['Digital Whiteboard', 'Podcast Equipment', 'Mood Lighting', 'Standing Desks'],
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    utilization: 60,
    price: 90,
    floor: '8th Floor',
    rating: 4.9
  },
  {
    id: 4,
    name: 'Conference Center Delta',
    capacity: 30,
    status: 'maintenance',
    features: ['Dual Projectors', 'Video Wall', 'Catering Service', 'Sound Proofing'],
    image: 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    utilization: 0,
    price: 200,
    floor: '20th Floor',
    rating: 4.7
  },
  {
    id: 5,
    name: 'Quantum Meeting Pod',
    capacity: 6,
    status: 'available',
    features: ['Touch Controls', 'Air Purification', 'Wireless Charging', 'Privacy Glass'],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    utilization: 45,
    price: 75,
    floor: '10th Floor',
    rating: 4.5
  }
])
const loading = ref(false) // Set to false since we have mock data
const searchQuery = ref('')
const selectedFilter = ref('all')

const filters = [
  { value: 'all', label: 'All Rooms' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' }
]

const fetchBoardrooms = async () => {
  try {
    loading.value = true
    // In a real app, uncomment this:
    // const response = await apiClient.get('/api/boardrooms')
    // boardrooms.value = response.data
    
    // We're using mock data so no need to fetch
    
  } catch (error) {
    console.error('Failed to fetch boardrooms:', error)
  } finally {
    loading.value = false
  }
}

const filteredBoardrooms = computed(() => {
  return boardrooms.value.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter = selectedFilter.value === 'all' || room.status === selectedFilter.value
    return matchesSearch && matchesFilter
  })
})

onMounted(fetchBoardrooms)
</script>

<template>
  <div class="boardrooms-page">
    <div class="page-header">
      <div class="header-content">
        <h1>All Boardrooms</h1>
        <button class="btn-primary" @click="router.push('/admin/boardrooms/new')">
          <i class="fas fa-plus"></i> Add New Room
        </button>
      </div>
      
      <div class="controls">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search boardrooms..."
          />
        </div>
        
        <div class="filter-controls">
          <select v-model="selectedFilter">
            <option v-for="filter in filters" 
                    :key="filter.value" 
                    :value="filter.value">
              {{ filter.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="boardrooms-grid" v-if="!loading">
      <div v-for="room in filteredBoardrooms" 
           :key="room.id" 
           class="room-card"
           :class="room.status">
        <div class="room-image">
          <img :src="room.image" :alt="room.name">
          <span class="status-badge">{{ room.status }}</span>
          <div class="price-badge">${{ room.price }}/hr</div>
        </div>
        
        <div class="room-content">
          <div class="room-header">
            <h3>{{ room.name }}</h3>
            <div class="rating">
              <i class="fas fa-star"></i>
              {{ room.rating }}
            </div>
          </div>

          <div class="room-info">
            <span><i class="fas fa-users"></i> {{ room.capacity }} people</span>
            <span><i class="fas fa-building"></i> {{ room.floor }}</span>
          </div>
          
          <div class="utilization-bar">
            <div class="bar-label">
              <span>Utilization</span>
              <span>{{ room.utilization }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${room.utilization}%` }"></div>
            </div>
          </div>
          
          <div class="features">
            <span v-for="feature in room.features" 
                  :key="feature" 
                  class="feature-tag">
              {{ feature }}
            </span>
          </div>
          
          <div class="actions">
            <button class="btn-secondary" @click="router.push(`/admin/boardrooms/${room.id}`)">
              <i class="fas fa-info-circle"></i> Details
            </button>
            <button class="btn-outline" @click="router.push(`/admin/scheduling/${room.id}`)">
              <i class="fas fa-calendar"></i> Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Loading boardrooms...</p>
    </div>
  </div>
</template>

<style scoped>
.boardrooms-page {
  padding: 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-content h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.boardrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.room-image {
  position: relative;
  height: 200px;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.available .status-badge {
  background: #dcfce7;
  color: #16a34a;
}

.occupied .status-badge {
  background: #fee2e2;
  color: #dc2626;
}

.maintenance .status-badge {
  background: #fef3c7;
  color: #d97706;
}

.room-content {
  padding: 1.5rem;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #eab308;
  font-weight: 600;
}

.price-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.room-info {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.utilization-bar {
  margin: 1rem 0;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3b82f6;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.feature-tag {
  padding: 0.25rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #4b5563;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary, .btn-outline {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-secondary {
  background: #1e40af;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
}

.btn-secondary:hover {
  background: #1e3a8a;
}

.btn-outline {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
}

.btn-outline:hover {
  background: #eff6ff;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  
  .boardrooms-grid {
    grid-template-columns: 1fr;
  }
}
</style>
