<script setup>
import { ref } from 'vue'

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const isAvailable = ref(props.room.status === 'Available')
</script>

<template>
  <div class="room-card">
    <img :src="room.picture" alt="Room Picture" class="room-picture" />
    <div class="room-details">
      <h3>{{ room.name }}</h3>
      <p><strong>Floor:</strong> {{ room.floor }}</p>
      <p><strong>Building:</strong> {{ room.building }}</p>
      <p><strong>Type:</strong> {{ room.type }}</p>
      <p :class="{'available': isAvailable, 'unavailable': !isAvailable}">
        <strong>Status:</strong> {{ room.status }}
      </p>
      <div class="quick-actions">
        <button class="btn btn-primary" :disabled="!isAvailable">Book Now</button>
        <button class="btn btn-secondary">View Details</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.room-card:hover {
  box-shadow: var(--shadow-lg);
}

.room-picture {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.room-details {
  padding: 1rem;
}

.room-details h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.room-details p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

.room-details .available {
  color: var(--success-color);
}

.room-details .unavailable {
  color: var(--danger-color);
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  flex: 1;
}
</style>
