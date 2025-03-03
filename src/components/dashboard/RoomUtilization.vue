<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartData = ref({
  labels: ['Room A', 'Room B', 'Room C', 'Room D', 'Room E'],
  datasets: [{
    label: 'Hours Used',
    data: [25, 18, 30, 15, 22],
    backgroundColor: '#4CAF50'
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Room Utilization (Hours)'
    }
  }
}
</script>

<template>
  <div class="room-utilization">
    <h3 class="section-title">Room Utilization</h3>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" height="200" />
    </div>
  </div>
</template>

<style scoped>
.room-utilization {
  padding: 1rem;
}

.section-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.chart-container {
  position: relative;
  height: 200px;
}
</style>
