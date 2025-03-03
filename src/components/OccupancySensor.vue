<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const occupancyStatus = ref('Unknown')

const fetchOccupancyStatus = async () => {
  try {
    const response = await axios.get(`/api/rooms/${props.roomId}/occupancy`)
    occupancyStatus.value = response.data.status
  } catch (error) {
    console.error('Failed to fetch occupancy status:', error)
  }
}

onMounted(() => {
  fetchOccupancyStatus()
})
</script>

<template>
  <div class="occupancy-sensor">
    <h3>Occupancy Status</h3>
    <p>Status: {{ occupancyStatus }}</p>
  </div>
</template>

<style scoped>
.occupancy-sensor {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 1.5rem;
}

.occupancy-sensor h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.occupancy-sensor p {
  margin: 0;
  color: var(--text-secondary);
}
</style>
