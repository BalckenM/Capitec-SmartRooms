import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    activeGateways: [],
    configurations: {},
    loading: false,
    error: null
  }),

  actions: {
    async saveGatewayConfig(gateway, config) {
      this.loading = true
      try {
        // TODO: API call to save gateway configuration
        this.configurations[gateway] = config
        this.activeGateways = [...new Set([...this.activeGateways, gateway])]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async toggleGateway(gateway, isActive) {
      if (isActive) {
        this.activeGateways.push(gateway)
      } else {
        this.activeGateways = this.activeGateways.filter(g => g !== gateway)
      }
      // TODO: API call to update gateway status
    }
  }
})
