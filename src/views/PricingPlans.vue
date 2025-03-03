<script setup>
import { ref } from 'vue'

const plans = ref([
  {
    id: 1,
    name: 'Basic',
    price: 99,
    billing: 'monthly',
    features: ['Up to 5 boardrooms', 'Basic smart controls', 'Email support']
  },
  {
    id: 2,
    name: 'Professional',
    price: 199,
    billing: 'monthly',
    features: ['Up to 15 boardrooms', 'Advanced smart controls', '24/7 support']
  }
])

const newPlan = ref({
  name: '',
  price: 0,
  billing: 'monthly',
  features: []
})

const addPlan = () => {
  plans.value.push({
    id: Date.now(),
    ...newPlan.value
  })
}
</script>

<template>
  <div class="pricing-plans">
    <div class="page-header">
      <h1>Pricing Plans Management</h1>
      <button class="add-plan-btn">Add New Plan</button>
    </div>

    <div class="plans-grid">
      <div v-for="plan in plans" :key="plan.id" class="plan-card">
        <div class="plan-header">
          <h3>{{ plan.name }}</h3>
          <div class="price">${{ plan.price }}/{{ plan.billing }}</div>
        </div>
        <ul class="features-list">
          <li v-for="feature in plan.features" :key="feature">
            {{ feature }}
          </li>
        </ul>
        <div class="plan-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-plans {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.plan-header {
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.features-list {
  list-style: none;
  padding: 1rem 0;
}

.features-list li {
  padding: 0.5rem 0;
}

.plan-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.add-plan-btn {
  background: var(--primary-color);
  color: white;
}

.edit-btn {
  background: #4CAF50;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}
</style>
