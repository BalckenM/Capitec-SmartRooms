<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'

const loading = ref(true)
const error = ref(null)
const facilities = ref([])
const { showToast } = useToast()

const fetchFacilities = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/facilities')
    if (!response.ok) throw new Error('Failed to fetch facilities')
    facilities.value = await response.json()
  } catch (err) {
    error.value = err.message
    showToast('Error loading facilities', 'error')
  } finally {
    loading.value = false
  }
}

const addFacility = async (facility) => {
  try {
    const response = await fetch('/api/facilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facility)
    })
    if (!response.ok) throw new Error('Failed to add facility')
    const newFacility = await response.json()
    facilities.value.push(newFacility)
    showToast('Facility added successfully', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

onMounted(() => {
  fetchFacilities()
})
</script>

<template>
  <div class="facilities-view">
    <LoadingSpinner :loading="loading" message="Loading facilities..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchFacilities">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <!-- Content implementation -->
    </div>
  </div>
</template>

<style scoped>
.facilities-view {
  position: relative;
  min-height: 200px;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
