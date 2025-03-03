<script setup>
import { ref } from 'vue'

const subscriptions = ref([
  {
    id: 1,
    clientName: 'Tech Corp Inc',
    plan: 'Professional',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    amount: 199,
    billingCycle: 'monthly',
    lastPayment: '2023-12-15'
  },
  {
    id: 2,
    clientName: 'Innovation Labs',
    plan: 'Basic',
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    amount: 99,
    billingCycle: 'monthly',
    lastPayment: '2023-12-01'
  }
])

const filterStatus = ref('all')
const sortBy = ref('clientName')
</script>

<template>
  <div class="subscriptions-view">
    <div class="page-header">
      <h1>Subscriptions Management</h1>
      <div class="header-actions">
        <select v-model="filterStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button class="new-sub-btn">
          <span class="material-icons">add</span>
          New Subscription
        </button>
      </div>
    </div>

    <div class="subscriptions-table">
      <table>
        <thead>
          <tr>
            <th @click="sortBy = 'clientName'">Client</th>
            <th @click="sortBy = 'plan'">Plan</th>
            <th @click="sortBy = 'status'">Status</th>
            <th @click="sortBy = 'startDate'">Start Date</th>
            <th @click="sortBy = 'endDate'">End Date</th>
            <th @click="sortBy = 'amount'">Amount</th>
            <th @click="sortBy = 'lastPayment'">Last Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subscriptions" :key="sub.id">
            <td>{{ sub.clientName }}</td>
            <td>{{ sub.plan }}</td>
            <td>
              <span :class="['status-badge', sub.status]">
                {{ sub.status }}
              </span>
            </td>
            <td>{{ sub.startDate }}</td>
            <td>{{ sub.endDate }}</td>
            <td>${{ sub.amount }}/{{ sub.billingCycle }}</td>
            <td>{{ sub.lastPayment }}</td>
            <td class="actions">
              <button class="icon-btn" title="Edit">
                <span class="material-icons">edit</span>
              </button>
              <button class="icon-btn" title="Renew">
                <span class="material-icons">autorenew</span>
              </button>
              <button class="icon-btn" title="Cancel">
                <span class="material-icons">cancel</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.subscriptions-view {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.new-sub-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.subscriptions-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  cursor: pointer;
  user-select: none;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.status-badge.active {
  background: #e6f4ea;
  color: #1e8e3e;
}

.status-badge.expired {
  background: #fce8e6;
  color: #d93025;
}

.status-badge.cancelled {
  background: #f1f3f4;
  color: #5f6368;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
}

.icon-btn:hover {
  color: var(--primary-color);
}

@media (max-width: 1024px) {
  .subscriptions-table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .subscriptions-table {
    font-size: 0.75rem;
  }
}
</style>
