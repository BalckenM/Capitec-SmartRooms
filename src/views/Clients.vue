<script setup>
import { ref } from 'vue'

const clients = ref([
  {
    id: 1,
    name: 'Tech Corp Inc',
    email: 'admin@techcorp.com',
    plan: 'Professional',
    status: 'Active',
    boardrooms: 8
  },
  {
    id: 2,
    name: 'Innovation Labs',
    email: 'contact@innovalabs.com',
    plan: 'Basic',
    status: 'Active',
    boardrooms: 3
  }
])

const searchQuery = ref('')
const filterStatus = ref('all')
</script>

<template>
  <div class="clients-view">
    <div class="page-header">
      <h1>Clients Management</h1>
      <button class="add-client-btn">
        <span class="material-icons">add</span>
        Add Client
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <span class="material-icons">search</span>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search clients..."
        >
      </div>
      <select v-model="filterStatus">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div class="clients-table">
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Boardrooms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>{{ client.name }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.plan }}</td>
            <td>
              <span :class="['status-badge', client.status.toLowerCase()]">
                {{ client.status }}
              </span>
            </td>
            <td>{{ client.boardrooms }}</td>
            <td class="actions">
              <button class="icon-btn">
                <span class="material-icons">edit</span>
              </button>
              <button class="icon-btn">
                <span class="material-icons">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.clients-view {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-client-btn {
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

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  flex: 1;
}

.search-box input {
  border: none;
  outline: none;
  padding: 0.25rem;
  width: 100%;
  margin-left: 0.5rem;
}

.clients-table {
  background: white;
  border-radius: 8px;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
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
}

.status-badge.active {
  background: #e6f4ea;
  color: #1e8e3e;
}

.status-badge.inactive {
  background: #fce8e6;
  color: #d93025;
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

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .clients-table {
    font-size: 0.875rem;
  }
}
</style>
