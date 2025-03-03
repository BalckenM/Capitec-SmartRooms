<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: {
    type: String,
    default: 'blue'
  }
})
</script>

<template>
  <div class="stat-card" :class="`color-${color}`">
    <div class="stat-icon">
      <i :class="`fas fa-${icon}`"></i>
    </div>
    <div class="stat-content">
      <h3 class="stat-value">{{ value }}</h3>
      <p class="stat-title">{{ title }}</p>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.stat-title {
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
}

.color-blue .stat-icon {
  background: #e0f2fe;
  color: #0284c7;
}

.color-green .stat-icon {
  background: #dcfce7;
  color: #16a34a;
}

.color-purple .stat-icon {
  background: #f3e8ff;
  color: #9333ea;
}

.color-orange .stat-icon {
  background: #fff7ed;
  color: #ea580c;
}
</style>
