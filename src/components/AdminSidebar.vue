<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

// Navigation sections
const navSections = ref([
  {
    title: 'Dashboard',
    icon: 'tachometer-alt',
    to: '/admin/dashboard',
    items: []
  },
  {
    title: 'Room Management',
    icon: 'building',
    isCollapsed: false,
    items: [
      { title: 'All Boardrooms', to: '/admin/boardrooms', icon: 'door-open' },
      { title: 'Room Types', to: '/admin/room-types', icon: 'layer-group' },
      { title: 'Spaces', to: '/admin/spaces', icon: 'map-marker-alt' },
      { title: 'Facilities', to: '/admin/facilities', icon: 'coffee' },
      { title: 'Maintenance', to: '/admin/maintenance', icon: 'tools' },
      { title: 'Room Scheduling', to: '/admin/scheduling', icon: 'calendar' }
    ]
  },
  {
    title: 'Smart Controls',
    icon: 'microchip',
    isCollapsed: true,
    items: [
      { title: 'Smart Devices', to: '/admin/smart-devices', icon: 'wifi' },
      { title: 'Automation', to: '/admin/automation', icon: 'robot' },
      { title: 'Monitoring', to: '/admin/monitoring', icon: 'chart-line' },
      { title: 'Alerts', to: '/admin/alerts', icon: 'bell' }
    ]
  },
  {
    title: 'Client Management',
    icon: 'users',
    isCollapsed: true,
    items: [
      { title: 'Clients', to: '/admin/clients', icon: 'user-tie' },
      { title: 'Organizations', to: '/admin/organizations', icon: 'building' },
      { title: 'User Access', to: '/admin/user-access', icon: 'key' },
      { title: 'Access Logs', to: '/admin/access-logs', icon: 'history' }
    ]
  },
  {
    title: 'Subscriptions',
    icon: 'credit-card',
    isCollapsed: true,
    items: [
      { title: 'Active Plans', to: '/admin/subscriptions', icon: 'clipboard-list' },
      { title: 'Plan Management', to: '/admin/subscription-plans', icon: 'tasks' }
    ]
  },
  {
    title: 'Analytics',
    icon: 'chart-pie',
    to: '/admin/usage-analytics',
    items: []
  },
  {
    title: 'Settings',
    icon: 'cog',
    isCollapsed: true,
    items: [
      { title: 'General', to: '/admin/settings/general', icon: 'sliders-h' },
      { title: 'Security', to: '/admin/settings/security', icon: 'shield-alt' },
      { title: 'Integrations', to: '/admin/settings/integrations', icon: 'plug' },
      { title: 'Email Templates', to: '/admin/settings/email-templates', icon: 'envelope' },
      { title: 'Backup & Restore', to: '/admin/settings/backup', icon: 'database' }
    ]
  }
])

// Toggle section collapse state
const toggleSection = (section) => {
  if (section.items && section.items.length) {
    section.isCollapsed = !section.isCollapsed
  } else if (section.to) {
    router.push(section.to)
  }
}

const isCurrentRoute = (route) => {
  return router.currentRoute.value.path === route
}

const sidebarClasses = computed(() => {
  return {
    'sidebar-open': props.isOpen,
    'sidebar-closed': !props.isOpen
  }
})
</script>

<template>
  <aside class="sidebar" :class="sidebarClasses">
    <div class="sidebar-header">
      <img src="../assets/logo.svg" alt="Logo" class="logo" v-if="isOpen" />
      <img src="../assets/logo-icon.svg" alt="Logo" class="logo-icon" v-else />
    </div>

    <nav class="sidebar-nav">
      <div 
        v-for="(section, index) in navSections" 
        :key="index" 
        class="nav-section">
        <div 
          class="section-header"
          :class="{ 'active': section.to && isCurrentRoute(section.to) }"
          @click="toggleSection(section)">
          <div class="header-content">
            <i :class="`fas fa-${section.icon}`"></i>
            <span v-if="isOpen" class="section-title">{{ section.title }}</span>
          </div>
          <i 
            v-if="section.items && section.items.length && isOpen" 
            :class="`fas fa-chevron-${section.isCollapsed ? 'down' : 'up'}`"
            class="collapse-icon">
          </i>
        </div>
        <transition name="slide">
          <div v-if="!section.isCollapsed && isOpen" class="section-items">
            <router-link 
              v-for="item in section.items" 
              :key="item.to"
              :to="item.to"
              class="nav-item"
              :class="{ 'active': isCurrentRoute(item.to) }">
              <i :class="`fas fa-${item.icon}`"></i>
              <span>{{ item.title }}</span>
            </router-link>
          </div>
        </transition>
      </div>
    </nav>

    <div class="sidebar-footer" v-if="isOpen">
      <div class="user-info">
        <div class="user-avatar">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
        </div>
        <div class="user-details">
          <p class="user-name">Admin User</p>
          <p class="user-role">Administrator</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  background-color: #1e293b;
  color: #e2e8f0;
  transition: all 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-open {
  width: 260px;
}

.sidebar-closed {
  width: 64px;
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid #2d3748;
}

.logo {
  height: 32px;
}

.logo-icon {
  height: 24px;
  width: 24px;
}

.sidebar-nav {
  padding: 1rem 0;
  flex: 1;
}

.nav-section:not(:last-child) {
  margin-bottom: 0.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 6px;
  margin: 0 0.5rem;
}

.section-header:hover {
  background-color: #2d3748;
}

.section-header.active {
  background-color: #3b82f6;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title {
  font-weight: 500;
  font-size: 0.875rem;
}

.section-items {
  padding-left: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.nav-item:hover {
  background-color: #334155;
}

.nav-item.active {
  background-color: #60a5fa;
  color: white;
}

.nav-item i {
  width: 16px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #2d3748;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.collapse-icon {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Animation for collapsible sections */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
