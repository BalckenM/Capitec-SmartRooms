<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../../services/axios'

const recentBookings = ref([])
const loading = ref(true)

const fetchRecentBookings = async () => {
  try {
    // Mock data for now - replace with actual API call
    recentBookings.value = [
      { id: 1, room: 'Executive Suite', client: 'John Doe', date: '2024-01-20', status: 'confirmed' },
      { id: 2, room: 'Meeting Room A', client: 'Jane Smith', date: '2024-01-21', status: 'pending' },
      { id: 3, room: 'Conference Hall', client: 'Tech Corp', date: '2024-01-22', status: 'confirmed' },
    ]
    loading.value = false
  } catch (error) {
    console.error('Failed to fetch recent bookings:', error)
    loading.value = false
  }
}

onMounted(fetchRecentBookings)
</script>

<template>
  <div class="recent-bookings">
    <h3 class="section-title">Recent Bookings</h3>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="bookings-list">
      <div v-for="booking in recentBookings" :key="booking.id" class="booking-item">
        <div class="booking-info">
          <h4>{{ booking.room }}</h4>
          <p>{{ booking.client }}</p>
        </div>
        <div class="booking-meta">
          <span class="date">{{ booking.date }}</span>
          <span :class="['status', booking.status]">{{ booking.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-bookings {
  padding: 1rem;
}

.section-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.booking-info h4 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.booking-info p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.status.confirmed {
  background: #dcfce7;
  color: #16a34a;
}

.status.pending {
  background: #fef3c7;
  color: #d97706;
}
</style>
