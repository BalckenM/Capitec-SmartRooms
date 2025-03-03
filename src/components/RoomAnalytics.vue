<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const usageData = ref({
  labels: [],
  datasets: [{
    label: 'Room Usage',
    data: [],
    fill: false,
    borderColor: '#4CAF50'
  }]
})

const fetchUsageData = async () => {
  try {
    const response = await axios.get(`/api/rooms/${props.roomId}/usage`)
    usageData.value.labels = response.data.labels
    usageData.value.datasets[0].data = response.data.data
  } catch (error) {
    console.error('Failed to fetch usage data:', error)
  }
}

onMounted(() => {
  fetchUsageData()
})
</script>

<template>
  <div class="room-analytics">
    <h3>Room Analytics</h3>
    <Line :data="usageData" />
  </div>
</template>

<style scoped>
.room-analytics {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 1.5rem;
}

.room-analytics h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}
</style>
