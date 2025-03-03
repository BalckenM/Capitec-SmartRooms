<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from '../../composables/useToast'
import logoSrc from '../../assets/images/logo.svg'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()

const credentials = ref({
  email: import.meta.env.DEV ? 'admin@meltscloud.com' : '',
  password: import.meta.env.DEV ? 'admin123' : '',
  remember: import.meta.env.DEV
})

const loading = ref(false)
const error = ref(null)

const validateForm = () => {
  if (import.meta.env.DEV) return true
  
  if (!credentials.value.email) {
    error.value = 'Email is required'
    return false
  }
  if (!credentials.value.password) {
    error.value = 'Password is required'
    return false
  }
  return true
}

const handleLogin = async () => {
  error.value = null
  
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    await authStore.login(credentials.value)
    
    // Redirect to intended route or dashboard
    const redirectPath = route.query.redirect || '/admin/dashboard'
    router.push(redirectPath)
    
    showToast('Login successful', 'success')
  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-header">
        <img :src="logoSrc" alt="MeltsCloud Logo" class="logo">
        <h1>Welcome Back</h1>
        <p>Log in to your admin account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-group">
            <span class="material-icons">email</span>
            <input 
              id="email"
              type="email"
              v-model="credentials.email"
              placeholder="Enter your email"
              :disabled="loading"
              autocomplete="email"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-group">
            <span class="material-icons">lock</span>
            <input 
              id="password"
              type="password"
              v-model="credentials.password"
              placeholder="Enter your password"
              :disabled="loading"
              autocomplete="current-password"
            >
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input 
              type="checkbox"
              v-model="credentials.remember"
            >
            Remember me
          </label>
          <a href="#" class="forgot-password">Forgot Password?</a>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          <span v-if="loading" class="loader"></span>
          <span v-else>Log In</span>
        </button>
      </form>

      <div class="login-footer">
        <p>Having trouble? <a href="#">Contact Support</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f6f7fb 0%, #edf1f7 100%);
  padding: 1rem;
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 120px;
  margin-bottom: 1.5rem;
}

.login-header h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.login-header p {
  color: var(--text-secondary);
  margin: 0.5rem 0 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 500;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-light);
}

.input-group:focus-within {
  border-color: var(--primary-color);
}

.input-group .material-icons {
  color: var(--text-secondary);
}

.input-group input {
  border: none;
  outline: none;
  background: none;
  width: 100%;
  font-size: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
}

.login-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
