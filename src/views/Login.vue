<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  email: 'admin@example.com',
  password: 'admin123'
})

// Auto-login function
const autoLogin = async () => {
  try {
    await authStore.login(credentials.value)
    router.push('/admin/dashboard')
  } catch (error) {
    console.error('Auto-login failed:', error)
  }
}

// Auto-login on component mount
onMounted(() => {
  autoLogin()
})

const handleLogin = async () => {
  await autoLogin()
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>MeltsCloud Admin</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="credentials.email"
            required
            placeholder="admin@example.com"
          >
        </div>
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="credentials.password"
            required
            placeholder="Enter your password"
          >
        </div>
        <button type="submit" class="login-button">Auto Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f8fa;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-top: 0.25rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

.error-message {
  color: #dc2626;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style>
