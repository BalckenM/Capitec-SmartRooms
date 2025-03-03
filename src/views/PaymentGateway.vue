<script setup>
import { ref } from 'vue'

const gateways = ref([
  { 
    id: 'payfast',
    name: 'PayFast',
    logo: '/images/payfast-logo.png',
    isActive: true,
    supportedMethods: ['credit-card', 'debit-card', 'eft', 'mobicred']
  },
  {
    id: 'peach',
    name: 'Peach Payments',
    logo: '/images/peach-logo.png',
    isActive: false,
    supportedMethods: ['credit-card', 'debit-card', 'instant-eft']
  },
  {
    id: 'ozow',
    name: 'Ozow',
    logo: '/images/ozow-logo.png',
    isActive: false,
    supportedMethods: ['instant-eft']
  },
  {
    id: 'yoco',
    name: 'Yoco',
    logo: '/images/yoco-logo.png',
    isActive: false,
    supportedMethods: ['credit-card', 'debit-card']
  },
  {
    id: 'snapscan',
    name: 'SnapScan',
    logo: '/images/snapscan-logo.png',
    isActive: false,
    supportedMethods: ['qr-code']
  },
  {
    id: 'zapper',
    name: 'Zapper',
    logo: '/images/zapper-logo.png',
    isActive: false,
    supportedMethods: ['qr-code']
  }
])

const payfastConfig = ref({
  merchantId: '',
  merchantKey: '',
  passphrase: '',
  testMode: true,
  returnUrl: '',
  cancelUrl: '',
  notifyUrl: ''
})

const selectedGateway = ref('payfast')

const saveConfiguration = async () => {
  // TODO: Implement save configuration
}
</script>

<template>
  <div class="payment-gateway">
    <h1>Payment Gateway Configuration</h1>
    
    <div class="gateway-grid">
      <div 
        v-for="gateway in gateways" 
        :key="gateway.id"
        class="gateway-card"
        :class="{ active: gateway.isActive }"
        @click="selectedGateway = gateway.id"
      >
        <div class="gateway-header">
          <h3>{{ gateway.name }}</h3>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="gateway.isActive"
            >
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="supported-methods">
          <span 
            v-for="method in gateway.supportedMethods" 
            :key="method"
            class="method-badge"
          >
            {{ method }}
          </span>
        </div>
        
        <!-- PayFast Configuration -->
        <div v-if="gateway.id === 'payfast' && selectedGateway === 'payfast'" class="gateway-form">
          <div class="form-group">
            <label>Merchant ID</label>
            <input 
              type="text" 
              v-model="payfastConfig.merchantId"
              placeholder="10000000"
            >
          </div>
          <div class="form-group">
            <label>Merchant Key</label>
            <input 
              type="password" 
              v-model="payfastConfig.merchantKey"
              placeholder="46f0cd694581a"
            >
          </div>
          <div class="form-group">
            <label>Passphrase</label>
            <input 
              type="password" 
              v-model="payfastConfig.passphrase"
              placeholder="Enter your passphrase"
            >
          </div>
          <div class="form-row">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="payfastConfig.testMode"
              >
              Test Mode
            </label>
          </div>
          <div class="form-group">
            <label>Return URL</label>
            <input 
              type="text" 
              v-model="payfastConfig.returnUrl"
              placeholder="https://your-domain.com/payment/success"
            >
          </div>
          <div class="form-group">
            <label>Cancel URL</label>
            <input 
              type="text" 
              v-model="payfastConfig.cancelUrl"
              placeholder="https://your-domain.com/payment/cancel"
            >
          </div>
          <div class="form-group">
            <label>Notify URL</label>
            <input 
              type="text" 
              v-model="payfastConfig.notifyUrl"
              placeholder="https://your-domain.com/api/payment/notify"
            >
          </div>
          <button class="save-btn" @click="saveConfiguration">Save Configuration</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-gateway {
  padding: 1rem;
}

.gateway-cards {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.gateway-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.gateway-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.gateway-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.method-badge {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  text-transform: capitalize;
}

.supported-methods {
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.form-row {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .gateway-grid {
    grid-template-columns: 1fr;
  }
}
</style>
