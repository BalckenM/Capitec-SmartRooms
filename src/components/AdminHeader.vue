<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// Notifications and messages for the header icons
const notifications = ref(3)
const messages = ref(5)
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <button class="toggle-btn" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="breadcrumbs">
        <span>Admin</span>
        <i class="fas fa-chevron-right separator"></i>
        <span>{{ $route.name || 'Dashboard' }}</span>
      </div>
    </div>
    
    <div class="header-right">
      <div class="header-action">
        <button class="action-btn">
          <i class="fas fa-search"></i>
        </button>
      </div>
      
      <div class="header-action">
        <button class="action-btn notification-btn">
          <i class="fas fa-bell"></i>
          <span class="badge" v-if="notifications">{{ notifications }}</span>
        </button>
      </div>
      
      <div class="header-action">
        <button class="action-btn">
          <i class="fas fa-envelope"></i>
          <span class="badge" v-if="messages">{{ messages }}</span>
        </button>
      </div>
      
      <div class="header-action user-dropdown">
        <button class="action-btn">
          <i class="fas fa-user-circle"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 100%;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #4b5563;
  font-size: 1.125rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-btn:hover {
  color: #3b82f6;
}

.breadcrumbs {
  display: none;
  align-items: center;
  margin-left: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.separator {
  margin: 0 0.5rem;
  font-size: 0.75rem;
}

.header-right {
  gap: 0.5rem;
}

.header-action {
  position: relative;
}

.action-btn {
  background: transparent;
  border: none;
  color: #4b5563;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.action-btn:hover {
  color: #3b82f6;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.25rem;
  border-radius: 9999px;
}

@media (min-width: 768px) {
  .breadcrumbs {
    display: flex;
  }
}
</style>
