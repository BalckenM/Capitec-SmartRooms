<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../services/axios'
import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import StatCard from '../components/dashboard/StatCard.vue'
import RecentBookings from '../components/dashboard/RecentBookings.vue'
import RoomUtilization from '../components/dashboard/RoomUtilization.vue'
import UpcomingMaintenance from '../components/dashboard/UpcomingMaintenance.vue'

ChartJS.register(ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const bookingStats = ref({
  total: 245,
  pending: 12,
  confirmed: 178,
  cancelled: 55
})

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Bookings',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: '#4CAF50'
  }]
}

const stats = ref({
  totalBookings: 0,
  activeRooms: 0,
  utilization: 0,
  revenue: 0
})

const roomUtilizationData = ref({
  labels: [],
  datasets: [{
    label: 'Room Utilization',
    data: [],
    fill: false,
    borderColor: '#4CAF50'
  }]
})

const popularRoomsData = ref({
  labels: [],
  datasets: [{
    label: 'Most Popular Rooms',
    data: [],
    backgroundColor: '#4CAF50'
  }]
})

const peakBookingTimesData = ref({
  labels: [],
  datasets: [{
    label: 'Peak Booking Times',
    data: [],
    backgroundColor: '#4CAF50'
  }]
})

const revenueData = ref({
  labels: [],
  datasets: [{
    label: 'Revenue from Bookings',
    data: [],
    backgroundColor: '#4CAF50'
  }]
})

const fetchMetrics = async () => {
  try {
    const response = await apiClient.get('/dashboard/metrics')
    roomUtilizationData.value.labels = response.data.roomUtilization.labels
    roomUtilizationData.value.datasets[0].data = response.data.roomUtilization.data
    popularRoomsData.value.labels = response.data.popularRooms.labels
    popularRoomsData.value.datasets[0].data = response.data.popularRooms.data
    peakBookingTimesData.value.labels = response.data.peakBookingTimes.labels
    peakBookingTimesData.value.datasets[0].data = response.data.peakBookingTimes.data
    revenueData.value.labels = response.data.revenue.labels
    revenueData.value.datasets[0].data = response.data.revenue.data
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
  }
}

onMounted(async () => {
  fetchMetrics()
  // Fetch dashboard data
  try {
    // Replace with actual API calls
    stats.value = {
      totalBookings: 156,
      activeRooms: 12,
      utilization: 78,
      revenue: 25600
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
})
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Dashboard Overview</h1>
    
    <div class="stats-grid">
      <StatCard
        title="Total Bookings"
        :value="stats.totalBookings"
        icon="calendar"
        color="blue"
      />
      <StatCard
        title="Active Rooms"
        :value="stats.activeRooms"
        icon="door-open"
        color="green"
      />
      <StatCard
        title="Utilization"
        :value="`${stats.utilization}%`"
        icon="chart-line"
        color="purple"
      />
      <StatCard
        title="Revenue"
        :value="`$${stats.revenue}`"
        icon="dollar-sign"
        color="orange"
      />
    </div>

    <div class="dashboard-grid">
      <div class="grid-item">
        <RecentBookings />
      </div>
      <div class="grid-item">
        <RoomUtilization />
      </div>
      <div class="grid-item wide">
        <UpcomingMaintenance />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 0.5rem; /* Reduce padding */
}

.dashboard-title {
  font-size: 1.25rem; /* Smaller title */
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem; /* Reduce margin */
  padding: 0.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.grid-item.wide {
  grid-column: 1 / -1;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
