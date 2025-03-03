<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const bookingDate = ref('')
const bookingTime = ref('')
const bookingDuration = ref(1)
const recurring = ref(false)
const recurrencePattern = ref('weekly')
const bookingNotes = ref('')
const bookingCapacity = ref(props.room.capacity || 10)

const handleBooking = async () => {
  try {
    const response = await axios.post(`/api/rooms/${props.room.id}/book`, {
      date: bookingDate.value,
      time: bookingTime.value,
      duration: bookingDuration.value,
      recurring: recurring.value,
      recurrencePattern: recurrencePattern.value,
      notes: bookingNotes.value,
      capacity: bookingCapacity.value
    })
    console.log('Booking successful:', response.data)
  } catch (error) {
    console.error('Failed to book room:', error)
  }
}
</script>

<template>
  <div class="scheduling-panel">
    <h3>Schedule a Booking for {{ room.name }}</h3>
    <div class="form-group">
      <label for="booking-date">Date</label>
      <input type="date" id="booking-date" v-model="bookingDate" class="form-control" />
    </div>
    <div class="form-group">
      <label for="booking-time">Time</label>
      <input type="time" id="booking-time" v-model="bookingTime" class="form-control" />
    </div>
    <div class="form-group">
      <label for="booking-duration">Duration (hours)</label>
      <input type="number" id="booking-duration" v-model="bookingDuration" min="1" class="form-control" />
    </div>
    <div class="form-group">
      <label for="booking-capacity">Capacity</label>
      <input type="number" id="booking-capacity" v-model="bookingCapacity" min="1" :max="props.room.capacity" class="form-control" />
    </div>
    <div class="form-group">
      <label for="booking-notes">Notes</label>
      <textarea id="booking-notes" v-model="bookingNotes" class="form-control"></textarea>
    </div>
    <div class="form-group">
      <label for="recurring">Recurring Booking</label>
      <input type="checkbox" id="recurring" v-model="recurring" />
    </div>
    <div class="form-group" v-if="recurring">
      <label for="recurrence-pattern">Recurrence Pattern</label>
      <select id="recurrence-pattern" v-model="recurrencePattern" class="form-control">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
    <button class="btn btn-primary" @click="handleBooking">Book Now</button>
  </div>
</template>

<style scoped>
.scheduling-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 1.5rem;
}

.scheduling-panel h3 {
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
