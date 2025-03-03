<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const selectedFloor = ref('')
const selectedBuilding = ref('')
const selectedRoomType = ref('')

const floors = ['1st Floor', '2nd Floor', '3rd Floor']
const buildings = ['Building A', 'Building B', 'Building C']
const roomTypes = ['Conference Room', 'Meeting Room', 'Private Office']

const emit = defineEmits(['search'])

const handleSearch = () => {
  emit('search', {
    query: searchQuery.value,
    floor: selectedFloor.value,
    building: selectedBuilding.value,
    roomType: selectedRoomType.value
  })
}
</script>

<template>
  <div class="room-search">
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search rooms..." 
      class="form-control"
    />
    <div class="filters">
      <select v-model="selectedFloor" class="form-control">
        <option value="">All Floors</option>
        <option v-for="floor in floors" :key="floor" :value="floor">{{ floor }}</option>
      </select>
      <select v-model="selectedBuilding" class="form-control">
        <option value="">All Buildings</option>
        <option v-for="building in buildings" :key="building" :value="building">{{ building }}</option>
      </select>
      <select v-model="selectedRoomType" class="form-control">
        <option value="">All Room Types</option>
        <option v-for="roomType in roomTypes" :key="roomType" :value="roomType">{{ roomType }}</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch">Search</button>
    </div>
  </div>
</template>

<style scoped>
.room-search {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.form-control {
  flex: 1;
}

.btn {
  flex-shrink: 0;
}
</style>
