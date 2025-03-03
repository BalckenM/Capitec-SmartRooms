<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const temperature = ref(22)

const setTemperature = async () => {
  try {
    const response = await axios.post(`/api/rooms/${props.roomId}/thermostat`, {
      temperature: temperature.value
    })
    temperature.value = response.data.temperature
  } catch (error) {
    console.error('Failed to set temperature:', error)
  }
}
</script>

<template>
  <div class="smart-thermostat-control">
    <h3>Smart Thermostat Control</h3>
    <div class="form-group">
      <label for="temperature">Temperature (°C)</label>
      <input type="number" id="temperature" v-model="temperature" class="form-control" />
    </div>
    <button class="btn btn-primary" @click="setTemperature">Set Temperature</button>
  </div>
</template>

<style scoped>
.smart-thermostat-control {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 1.5rem;
}

.smart-thermostat-control h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

.btn {
  margin-top: 1rem;
  width: 100%;
}
</style>
