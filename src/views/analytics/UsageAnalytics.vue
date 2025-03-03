<script setup>
import { ref, onMounted, computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const loading = ref(true)
const error = ref(null)
const dateRange = ref('week')
const selectedMetric = ref('bookings')

const analyticsData = ref({
  bookings: {
    daily: [120, 145, 132, 168, 176, 158, 142],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  occupancy: {
    rates: [65, 72, 68, 85, 82, 76, 70],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  usage: {
    hours: [180, 210, 195, 240, 225, 195, 165],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
})

const roomStats = ref({
  totalRooms: 15,
  activeRooms: 12,
  maintenanceRooms: 2,
  averageOccupancy: 73,
  peakHours: '09:00 - 15:00',
  popularRooms: [
    { name: 'Executive Suite', bookings: 45, occupancy: 82 },
    { name: 'Innovation Lab', bookings: 38, occupancy: 76 },
    { name: 'Training Room', bookings: 32, occupancy: 68 }
  ]
})

const { showToast } = useToast()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const lineChartData = computed(() => ({
  labels: analyticsData.value[selectedMetric.value].labels,
  datasets: [
    {
      label: selectedMetric.value.charAt(0).toUpperCase() + selectedMetric.value.slice(1),
      data: analyticsData.value[selectedMetric.value][
        selectedMetric.value === 'occupancy' ? 'rates' : 
        selectedMetric.value === 'usage' ? 'hours' : 'daily'
      ],
      borderColor: '#4f46e5',
      tension: 0.4
    }
  ]
}))

const fetchAnalytics = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load analytics data', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})
</script>

<template>
  <div class="analytics-view">
    <LoadingSpinner :loading="loading" message="Loading analytics..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchAnalytics">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Usage Analytics</h1>
        <div class="header-actions">
          <select v-model="dateRange" class="date-range">
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
          </select>
          <button class="export-btn">
            <span class="material-icons">download</span>
            Export Report
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Rooms</h3>
          <div class="stat-value">{{ roomStats.totalRooms }}</div>
          <div class="stat-breakdown">
            <span class="active">{{ roomStats.activeRooms }} Active</span>
            <span class="maintenance">{{ roomStats.maintenanceRooms }} In Maintenance</span>
          </div>
        </div>
        <div class="stat-card">
          <h3>Average Occupancy</h3>
          <div class="stat-value">{{ roomStats.averageOccupancy }}%</div>
          <div class="peak-hours">Peak: {{ roomStats.peakHours }}</div>
        </div>
        <div class="stat-card">
          <h3>Most Popular Room</h3>
          <div class="stat-value">{{ roomStats.popularRooms[0].name }}</div>
          <div class="room-stats">
            {{ roomStats.popularRooms[0].bookings }} bookings this {{ dateRange }}
          </div>
        </div>
      </div>

      <div class="chart-section">
        <div class="chart-header">
          <h2>Usage Trends</h2>
          <div class="metric-selector">
            <button 
              v-for="metric in ['bookings', 'occupancy', 'usage']"
              :key="metric"
              :class="['metric-btn', { active: selectedMetric === metric }]"
              @click="selectedMetric = metric"
            >
              {{ metric.charAt(0).toUpperCase() + metric.slice(1) }}
            </button>
          </div>
        </div>
        
        <div class="chart-container">
          <Line 
            :data="lineChartData"
            :options="chartOptions"
            height="300"
          />
        </div>
      </div>

      <div class="popular-rooms">
        <h2>Room Performance</h2>
        <div class="rooms-grid">
          <div 
            v-for="room in roomStats.popularRooms"
            :key="room.name"
            class="room-card"
          >
            <h3>{{ room.name }}</h3>
            <div class="room-metrics">
              <div class="metric">
                <span class="label">Bookings</span>
                <span class="value">{{ room.bookings }}</span>
              </div>
              <div class="metric">
                <span class="label">Occupancy</span>
                <span class="value">{{ room.occupancy }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-view {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0.5rem 0;
}

.chart-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.metric-selector {
  display: flex;
  gap: 0.5rem;
}

.metric-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.metric-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.chart-container {
  height: 300px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.room-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.room-metrics {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.metric .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .metric-selector {
    width: 100%;
  }
  
  .metric-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
