<script setup>
import { ref, onMounted, onErrorCaptured } from 'vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import AdminHeader from '../components/AdminHeader.vue'
import 'sweetalert2/dist/sweetalert2.min.css'
import '../assets/css/admin-theme.css'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  console.log('Admin layout mounted')
})

onErrorCaptured((err, vm, info) => {
  console.error('Error in AdminLayout:', err)
  return false
})
</script>

<template>
  <div class="admin-wrapper" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <AdminSidebar 
      class="admin-sidebar" 
      :is-open="isSidebarOpen"
    />
    <div class="main-content">
      <AdminHeader 
        class="admin-header shadow-admin" 
        @toggle-sidebar="toggleSidebar"
      />
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <Suspense>
              <component :is="Component" />
              <template #fallback>
                <div class="loading-spinner">
                  <div class="spinner"></div>
                </div>
              </template>
            </Suspense>
          </Transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background-color: #f8f9fa;
}

.admin-sidebar {
  position: fixed;
  height: 100vh;
  width: 260px;
  z-index: 100;
  transition: transform 0.3s ease;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 0; /* Remove padding from main content */
}

.admin-header {
  height: 48px; /* Reduce header height */
  min-height: 48px;
  padding: 0 1rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.content-wrapper {
  padding: 1rem;
  margin: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.container-fluid {
  flex: 1;
  padding: 2rem;
  background: #f8f9fc;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
  
  .admin-sidebar {
    transform: translateX(0);
  }
  
  .sidebar-closed .admin-sidebar {
    transform: translateX(-100%);
  }
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .container-fluid {
    padding: 0.5rem;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  gap: 0.5rem;
}

.nav-item:hover {
  background-color: var(--hover-bg);
}

.nav-item.router-link-active {
  background-color: var(--active-bg);
  color: var(--primary-color);
}

.sidebar-closed .main-content {
  margin-left: 0;
}
</style>
