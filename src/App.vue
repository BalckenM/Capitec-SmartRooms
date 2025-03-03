<script setup>
import { onMounted, onErrorCaptured } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  console.log('App mounted')
  try {
    authStore.initAuth()
  } catch (err) {
    console.error('Auth initialization failed:', err)
  }
})

onErrorCaptured((err, vm, info) => {
  console.error('Error captured in App:', err)
  console.error('Error info:', info)
  return false // Prevent error from propagating
})
</script>

<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
