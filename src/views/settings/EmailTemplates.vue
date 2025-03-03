<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'

const loading = ref(true)
const error = ref(null)
const showPreview = ref(false)
const selectedTemplate = ref(null)
const testEmailAddress = ref('')

const templates = ref([
  {
    id: 'booking-confirmation',
    name: 'Booking Confirmation',
    subject: 'Your Boardroom Booking Confirmation',
    variables: ['userName', 'roomName', 'date', 'startTime', 'endTime'],
    content: `Dear {{userName}},

Your boardroom booking has been confirmed:

Room: {{roomName}}
Date: {{date}}
Time: {{startTime}} - {{endTime}}

Thank you for using our service.

Best regards,
MeltsCloud Team`,
    active: true
  },
  {
    id: 'booking-reminder',
    name: 'Booking Reminder',
    subject: 'Reminder: Upcoming Boardroom Booking',
    variables: ['userName', 'roomName', 'date', 'startTime'],
    content: `Hi {{userName}},

This is a reminder of your upcoming booking:

Room: {{roomName}}
Date: {{date}}
Time: {{startTime}}

Best regards,
MeltsCloud Team`,
    active: true
  },
  {
    id: 'maintenance-notification',
    name: 'Maintenance Notification',
    subject: 'Boardroom Maintenance Schedule',
    variables: ['roomName', 'maintenanceDate', 'duration', 'reason'],
    content: `Important Notice:

The {{roomName}} will be undergoing maintenance on {{maintenanceDate}} for approximately {{duration}}.

Reason: {{reason}}

We apologize for any inconvenience.

Best regards,
MeltsCloud Team`,
    active: true
  }
])

const { showToast } = useToast()

const fetchTemplates = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = err.message
    showToast('Failed to load email templates', 'error')
  } finally {
    loading.value = false
  }
}

const saveTemplate = async (template) => {
  try {
    await api.put(`/settings/email-templates/${template.id}`, template)
    showToast('Template saved successfully', 'success')
  } catch (err) {
    showToast('Failed to save template', 'error')
  }
}

const previewTemplate = (template) => {
  selectedTemplate.value = { ...template }
  showPreview.value = true
}

const sendTestEmail = async (template) => {
  if (!testEmailAddress.value) {
    showToast('Please enter a test email address', 'error')
    return
  }

  try {
    await api.post(`/settings/email-templates/${template.id}/test`, {
      email: testEmailAddress.value
    })
    showToast('Test email sent successfully', 'success')
    testEmailAddress.value = ''
  } catch (err) {
    showToast('Failed to send test email', 'error')
  }
}

const insertVariable = (template, variable) => {
  const textArea = document.querySelector(`#template-${template.id}`)
  if (textArea) {
    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const text = textArea.value
    const newText = `${text.substring(0, start)}{{${variable}}}${text.substring(end)}`
    template.content = newText
    // Restore cursor position after variable insertion
    setTimeout(() => {
      textArea.focus()
      textArea.setSelectionRange(start + variable.length + 4, start + variable.length + 4)
    })
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>

<template>
  <div class="email-templates-view">
    <LoadingSpinner :loading="loading" message="Loading email templates..." />
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchTemplates">Retry</button>
    </div>
    
    <div v-if="!loading && !error" class="content">
      <div class="page-header">
        <h1>Email Templates</h1>
      </div>

      <div class="templates-grid">
        <div 
          v-for="template in templates" 
          :key="template.id" 
          class="template-card"
        >
          <div class="template-header">
            <h3>{{ template.name }}</h3>
            <label class="switch">
              <input 
                type="checkbox"
                v-model="template.active"
                @change="saveTemplate(template)"
              >
              <span class="slider"></span>
            </label>
          </div>

          <div class="template-subject">
            <label>Subject</label>
            <input 
              type="text"
              v-model="template.subject"
              @change="saveTemplate(template)"
            >
          </div>

          <div class="template-content">
            <label>Content</label>
            <div class="variables-list">
              <button 
                v-for="variable in template.variables"
                :key="variable"
                class="variable-btn"
                @click="insertVariable(template, variable)"
              >
                {{variable}}
              </button>
            </div>
            <textarea 
              :id="'template-' + template.id"
              v-model="template.content"
              rows="8"
              @change="saveTemplate(template)"
            ></textarea>
          </div>

          <div class="template-actions">
            <button 
              class="preview-btn"
              @click="previewTemplate(template)"
            >
              <span class="material-icons">visibility</span>
              Preview
            </button>
            <div class="test-email">
              <input 
                type="email"
                v-model="testEmailAddress"
                placeholder="Enter test email"
              >
              <button 
                class="send-btn"
                @click="sendTestEmail(template)"
              >
                <span class="material-icons">send</span>
                Send Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Preview: {{ selectedTemplate?.name }}</h2>
          <button class="close-btn" @click="showPreview = false">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="preview-subject">
            <strong>Subject:</strong> {{ selectedTemplate?.subject }}
          </div>
          <div class="preview-content">
            {{ selectedTemplate?.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-templates-view {
  padding: 1rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.template-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.template-subject input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-top: 0.25rem;
}

.variables-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.variable-btn {
  padding: 0.25rem 0.5rem;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.template-content textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.template-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.test-email {
  display: flex;
  gap: 0.5rem;
}

.preview-btn, .send-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.preview-btn {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.send-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.preview-subject {
  margin-bottom: 1rem;
}

.preview-content {
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .template-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .test-email {
    width: 100%;
  }
  
  .preview-btn, .send-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
