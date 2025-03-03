<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const meetingLink = ref('')

const createMeeting = async () => {
  try {
    const response = await axios.post(`/api/rooms/${props.roomId}/video-conference`)
    meetingLink.value = response.data.link
  } catch (error) {
    console.error('Failed to create meeting:', error)
  }
}
</script>

<template>
  <div class="video-conferencing">
    <h3>Video Conferencing</h3>
    <button class="btn btn-primary" @click="createMeeting">Create Meeting</button>
    <p v-if="meetingLink">Meeting Link: <a :href="meetingLink" target="_blank">{{ meetingLink }}</a></p>
  </div>
</template>

<style scoped>
.video-conferencing {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 1.5rem;
}

.video-conferencing h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.video-conferencing p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
}

.btn {
  margin-top: 1rem;
  width: 100%;
}
</style>
