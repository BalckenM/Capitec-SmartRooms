<script setup>
import RoomSchedulingPanel from '../components/RoomSchedulingPanel.vue'
import { ref } from 'vue'

const selectedRoom = ref({
  id: 1,
  name: 'Default Room',
  capacity: 10
  // Add other default room properties as needed
})
</script>

<template>
  <div class="scheduling-view">
    <h2>Room Scheduling</h2>
    <RoomSchedulingPanel :room="selectedRoom" />
  </div>
</template>

<style scoped>
.scheduling-view {
  padding: 1.5rem;
}

h2 {
  margin-bottom: 1.5rem;
}
</style>
