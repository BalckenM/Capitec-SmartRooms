<script setup>
import { ref } from 'vue'

const boardrooms = ref([
  {
    id: 1,
    name: 'Executive Suite',
    features: {
      lighting: { status: 'on', brightness: 80 },
      temperature: { status: 'on', value: 22 },
      projector: { status: 'off' },
      blinds: { status: 'open' },
      videoConference: { status: 'ready' }
    }
  },
  {
    id: 2,
    name: 'Innovation Lab',
    features: {
      lighting: { status: 'on', brightness: 60 },
      temperature: { status: 'on', value: 23 },
      projector: { status: 'on' },
      blinds: { status: 'closed' },
      videoConference: { status: 'in-use' }
    }
  }
])

const toggleFeature = (room, feature) => {
  const currentStatus = room.features[feature].status
  room.features[feature].status = currentStatus === 'on' ? 'off' : 'on'
}

const updateValue = (room, feature, value) => {
  room.features[feature].value = value
}
</script>

<template>
  <div class="smart-controls">
    <div class="page-header">
      <h1>Smart Controls Management</h1>
      <button class="sync-btn">
        <span class="material-icons">sync</span>
        Sync Devices
      </button>
    </div>

    <div class="boardrooms-grid">
      <div v-for="room in boardrooms" :key="room.id" class="room-card">
        <div class="room-header">
          <h3>{{ room.name }}</h3>
          <span class="status-badge" :class="room.features.videoConference.status">
            {{ room.features.videoConference.status }}
          </span>
        </div>

        <div class="controls-grid">
          <!-- Lighting Control -->
          <div class="control-item">
            <div class="control-header">
              <span class="material-icons">lightbulb</span>
              <span>Lighting</span>
            </div>
            <div class="control-actions">
              <input 
                type="range" 
                v-model="room.features.lighting.brightness" 
                min="0" 
                max="100"
              >
              <button 
                :class="['toggle-btn', room.features.lighting.status]"
                @click="toggleFeature(room, 'lighting')"
              >
                {{ room.features.lighting.status }}
              </button>
            </div>
          </div>

          <!-- Temperature Control -->
          <div class="control-item">
            <div class="control-header">
              <span class="material-icons">thermostat</span>
              <span>Temperature</span>
            </div>
            <div class="control-actions">
              <div class="temp-control">
                <button @click="updateValue(room, 'temperature', room.features.temperature.value - 1)">-</button>
                <span>{{ room.features.temperature.value }}°C</span>
                <button @click="updateValue(room, 'temperature', room.features.temperature.value + 1)">+</button>
              </div>
            </div>
          </div>

          <!-- Other Controls -->
          <div class="control-item">
            <div class="control-header">
              <span class="material-icons">video_projector</span>
              <span>Projector</span>
            </div>
            <button 
              :class="['toggle-btn', room.features.projector.status]"
              @click="toggleFeature(room, 'projector')"
            >
              {{ room.features.projector.status }}
            </button>
          </div>

          <div class="control-item">
            <div class="control-header">
              <span class="material-icons">blinds</span>
              <span>Blinds</span>
            </div>
            <button 
              :class="['toggle-btn', room.features.blinds.status]"
              @click="toggleFeature(room, 'blinds')"
            >
              {{ room.features.blinds.status }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.smart-controls {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sync-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.boardrooms-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.room-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.controls-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

.control-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.control-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-transform: capitalize;
}

.toggle-btn.on {
  background: #4CAF50;
  color: white;
}

.toggle-btn.off {
  background: #ccc;
}

.temp-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.temp-control button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.status-badge.ready {
  background: #e6f4ea;
  color: #1e8e3e;
}

.status-badge.in-use {
  background: #fce8e6;
  color: #d93025;
}

@media (max-width: 768px) {
  .boardrooms-grid {
    grid-template-columns: 1fr;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }
}
</style>
