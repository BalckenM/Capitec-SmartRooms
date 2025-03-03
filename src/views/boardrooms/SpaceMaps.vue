<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentFloor = ref(1)
const mapScale = ref(1)
const isEditMode = ref(false)
const selectedFilter = ref('all')
const searchQuery = ref('')

// Filters for rooms
const filters = [
  { value: 'all', label: 'All Spaces' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' }
]

const floors = ref([
  { 
    id: 1, 
    name: '1st Floor', 
    roomCount: 8,
    description: 'Main reception, executive offices, and conference rooms'
  },
  { 
    id: 2, 
    name: '2nd Floor', 
    roomCount: 12,
    description: 'Meeting pods, creative studios, and breakout areas'
  },
  { 
    id: 3, 
    name: '3rd Floor', 
    roomCount: 10,
    description: 'Training rooms, technical spaces, and client areas'
  }
])

// Enhanced room data with more details
const rooms = ref({
  1: [
    { 
      id: 101, 
      name: 'Executive Meeting Room 101', 
      type: 'meeting', 
      status: 'available', 
      position: { x: 120, y: 150 }, 
      width: 100, 
      height: 80, 
      capacity: 12,
      equipment: ['Video Conferencing', 'Smart Display', 'Coffee Machine'],
      nextBooking: '2:00 PM - 3:30 PM',
      temperature: 72,
      lightLevel: 80,
      occupancyRate: 65
    },
    { 
      id: 102, 
      name: 'Conference Room 102', 
      type: 'conference', 
      status: 'occupied', 
      position: { x: 240, y: 150 }, 
      width: 120, 
      height: 80, 
      capacity: 20,
      equipment: ['Dual Projectors', 'Audio System', 'Whiteboard'],
      nextBooking: '4:00 PM - 5:30 PM',
      temperature: 70,
      lightLevel: 90,
      occupancyRate: 78
    },
    { id: 103, name: 'Office 103', type: 'office', status: 'available', position: { x: 380, y: 150 }, width: 80, height: 80 },
    { id: 104, name: 'Breakout Space 104', type: 'breakout', status: 'available', position: { x: 120, y: 250 }, width: 100, height: 60 },
    { id: 105, name: 'Office 105', type: 'office', status: 'maintenance', position: { x: 240, y: 250 }, width: 80, height: 60 },
    { id: 106, name: 'Meeting Room 106', type: 'meeting', status: 'occupied', position: { x: 340, y: 250 }, width: 120, height: 60 },
    { id: 107, name: 'Office 107', type: 'office', status: 'available', position: { x: 200, y: 330 }, width: 80, height: 60 },
    { id: 108, name: 'Creative Studio 108', type: 'studio', status: 'available', position: { x: 300, y: 330 }, width: 100, height: 60 }
  ],
  2: [
    { id: 201, name: 'Executive Suite 201', type: 'meeting', status: 'occupied', position: { x: 150, y: 120 }, width: 120, height: 100 },
    { id: 202, name: 'Large Conference 202', type: 'conference', status: 'available', position: { x: 290, y: 120 }, width: 150, height: 100 },
    { id: 203, name: 'Office 203', type: 'office', status: 'maintenance', position: { x: 150, y: 240 }, width: 70, height: 80 },
    { id: 204, name: 'Office 204', type: 'office', status: 'available', position: { x: 240, y: 240 }, width: 70, height: 80 },
    { id: 205, name: 'Office 205', type: 'office', status: 'available', position: { x: 330, y: 240 }, width: 70, height: 80 },
    { id: 206, name: 'Meeting Pod 206', type: 'meeting', status: 'occupied', position: { x: 420, y: 240 }, width: 70, height: 80 }
    // Add more rooms as needed for 2nd floor
  ],
  3: [
    { id: 301, name: 'Board Room 301', type: 'meeting', status: 'available', position: { x: 200, y: 150 }, width: 150, height: 120 },
    { id: 302, name: 'Training Room 302', type: 'training', status: 'occupied', position: { x: 370, y: 150 }, width: 120, height: 120 },
    { id: 303, name: 'Office 303', type: 'office', status: 'available', position: { x: 200, y: 290 }, width: 80, height: 70 }
    // Add more rooms as needed for 3rd floor
  ]
})

// Add corridor and walkways for better visualization
const corridors = ref({
  1: [
    { start: { x: 200, y: 100 }, end: { x: 200, y: 400 }, width: 30 },
    { start: { x: 100, y: 200 }, end: { x: 500, y: 200 }, width: 30 },
  ],
  2: [
    { start: { x: 200, y: 100 }, end: { x: 200, y: 400 }, width: 30 },
    { start: { x: 100, y: 300 }, end: { x: 500, y: 300 }, width: 30 },
  ],
  3: [
    { start: { x: 300, y: 100 }, end: { x: 300, y: 400 }, width: 30 },
    { start: { x: 100, y: 250 }, end: { x: 500, y: 250 }, width: 30 },
  ]
})

// Add building facilities
const facilities = ref({
  1: [
    { type: 'elevator', position: { x: 50, y: 200 }, width: 40, height: 40 },
    { type: 'stairs', position: { x: 50, y: 260 }, width: 40, height: 40 },
    { type: 'restroom', position: { x: 500, y: 150 }, width: 40, height: 60 },
    { type: 'kitchen', position: { x: 500, y: 250 }, width: 60, height: 60 }
  ],
  2: [
    { type: 'elevator', position: { x: 50, y: 200 }, width: 40, height: 40 },
    { type: 'stairs', position: { x: 50, y: 260 }, width: 40, height: 40 },
    { type: 'restroom', position: { x: 500, y: 150 }, width: 40, height: 60 }
  ],
  3: [
    { type: 'elevator', position: { x: 50, y: 200 }, width: 40, height: 40 },
    { type: 'stairs', position: { x: 50, y: 260 }, width: 40, height: 40 },
    { type: 'restroom', position: { x: 500, y: 150 }, width: 40, height: 60 }
  ]
})

const selectedRoom = ref(null)
const showRoomDetails = ref(false)
const showAnalytics = ref(false)
const isMovingRoom = ref(false)
const movingRoomId = ref(null)

// Filter rooms based on search and status filter
const filteredRooms = computed(() => {
  return rooms.value[currentFloor.value].filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter = selectedFilter.value === 'all' || room.status === selectedFilter.value
    return matchesSearch && matchesFilter
  })
})

// Room utilization stats
const floorUtilization = computed(() => {
  const floorRooms = rooms.value[currentFloor.value]
  const availableCount = floorRooms.filter(r => r.status === 'available').length
  const occupiedCount = floorRooms.filter(r => r.status === 'occupied').length
  const maintenanceCount = floorRooms.filter(r => r.status === 'maintenance').length
  
  return {
    available: availableCount,
    occupied: occupiedCount,
    maintenance: maintenanceCount,
    utilization: floorRooms.length > 0 ? Math.round((occupiedCount / floorRooms.length) * 100) : 0
  }
})

// Handle room selection
const selectRoom = (room) => {
  if (isEditMode.value) {
    isMovingRoom.value = true
    movingRoomId.value = room.id
  } else {
    selectedRoom.value = room
    showRoomDetails.value = true
  }
}

const closeRoomDetails = () => {
  showRoomDetails.value = false
}

// Map zooming
const zoomIn = () => {
  if (mapScale.value < 1.5) mapScale.value += 0.1
}

const zoomOut = () => {
  if (mapScale.value > 0.5) mapScale.value -= 0.1
}

const resetZoom = () => {
  mapScale.value = 1
}

// Handle map clicks for moving rooms in edit mode
const handleMapClick = (event) => {
  if (!isEditMode.value || !isMovingRoom.value) return
  
  // Get click coordinates relative to map
  const mapElement = document.querySelector('.floor-map')
  const rect = mapElement.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Update room position
  const room = rooms.value[currentFloor.value].find(r => r.id === movingRoomId.value)
  if (room) {
    room.position.x = x
    room.position.y = y
  }
  
  isMovingRoom.value = false
  movingRoomId.value = null
}

// Schedule a room
const scheduleRoom = (roomId) => {
  router.push(`/admin/scheduling/${roomId}`)
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    isMovingRoom.value = false
    movingRoomId.value = null
  }
}

const toggleAnalytics = () => {
  showAnalytics.value = !showAnalytics.value
}

// Get class for room status
const getRoomStatusClass = (status) => {
  switch (status) {
    case 'available': return 'status-available'
    case 'occupied': return 'status-occupied'
    case 'maintenance': return 'status-maintenance'
    default: return ''
  }
}

// Get icon for room type or facility
const getIcon = (type) => {
  switch (type) {
    case 'meeting': return 'fas fa-handshake'
    case 'conference': return 'fas fa-users'
    case 'office': return 'fas fa-briefcase'
    case 'breakout': return 'fas fa-coffee'
    case 'studio': return 'fas fa-palette'
    case 'training': return 'fas fa-chalkboard-teacher'
    case 'elevator': return 'fas fa-elevator'
    case 'stairs': return 'fas fa-walking'
    case 'restroom': return 'fas fa-restroom'
    case 'kitchen': return 'fas fa-utensils'
    default: return 'fas fa-door-open'
  }
}

// User's current position (simulated)
const userPosition = ref({ x: 80, y: 100 })
const showNavigation = ref(false)
const navigationTarget = ref(null)
const navigationPath = ref([])

// Dragging functionality
const isDragging = ref(false)
const draggedRoom = ref(null)
const dragOffset = ref({ x: 0, y: 0 })
const savedPositions = ref({})

// Enable/disable dragging mode with tutorial
const dragMode = ref(false)
const showDragTutorial = ref(false)

// Store original positions when drag mode is enabled
const originalPositions = {}

// Track the last room being hovered over for snapping
const hoverRoom = ref(null)

// Enhanced toggle drag mode function with tutorial
const toggleDragMode = () => {
  dragMode.value = !dragMode.value
  
  if (dragMode.value) {
    showDragTutorial.value = true
    setTimeout(() => {
      showDragTutorial.value = false
    }, 5000) // Hide tutorial after 5 seconds
  } else {
    isDragging.value = false
    draggedRoom.value = null
    showDragTutorial.value = false
  }
}

// Enhanced startDrag function with snapping functionality
const startDrag = (room, event) => {
  if (!dragMode.value) return
  
  isDragging.value = true
  draggedRoom.value = room
  
  // Store original position if not already stored
  const positionKey = `${currentFloor.value}-${room.id}`
  if (!originalPositions[positionKey]) {
    originalPositions[positionKey] = { ...room.position }
  }
  
  const mapElement = document.querySelector('.floor-map')
  const rect = mapElement.getBoundingClientRect()
  
  // Calculate offset to keep the relative position within the room
  dragOffset.value = {
    x: (event.clientX - rect.left) - room.position.x,
    y: (event.clientY - rect.top) - room.position.y
  }
  
  // Add ghost effect to the room
  event.target.classList.add('dragging')
  
  // Prevent default behavior
  event.preventDefault()
}

// Handle dragging
const handleDrag = (event) => {
  if (!isDragging.value || !draggedRoom.value) return
  
  const mapElement = document.querySelector('.floor-map')
  const rect = mapElement.getBoundingClientRect()
  
  // Update the room position based on mouse position
  draggedRoom.value.position = {
    x: (event.clientX - rect.left) - dragOffset.value.x,
    y: (event.clientY - rect.top) - dragOffset.value.y
  }
}

// Handle drag end
const endDrag = () => {
  if (isDragging.value && draggedRoom.value) {
    // Save the new position
    savedPositions.value[`${currentFloor.value}-${draggedRoom.value.id}`] = {
      ...draggedRoom.value.position
    }
  }
  
  isDragging.value = false
  draggedRoom.value = null
}

// Save layout changes permanently
const saveLayout = () => {
  // Here you would typically call an API to save the changes to the backend
  // For now, we'll just update the local state
  Object.keys(savedPositions.value).forEach(key => {
    const [floorId, roomId] = key.split('-').map(Number)
    const room = rooms.value[floorId].find(r => r.id === roomId)
    if (room) {
      room.position = { ...savedPositions.value[key] }
    }
  })
  
  // Clear saved positions
  savedPositions.value = {}
}

// Discard changes
const discardChanges = () => {
  // Restore original positions
  Object.keys(savedPositions.value).forEach(key => {
    const [floorId, roomId] = key.split('-').map(Number)
    const room = rooms.value[floorId].find(r => r.id === roomId)
    if (room && originalPositions[key]) {
      room.position = { ...originalPositions[key] }
    }
  })
  
  // Clear saved positions
  savedPositions.value = {}
}

// Handle locate button click
const locateRoom = (room) => {
  showNavigation.value = true
  navigationTarget.value = room
  generateNavigationPath(userPosition.value, room.position)
}

// Generate a path from start to end positions
const generateNavigationPath = (start, end) => {
  // Generate a simple path with waypoints - in a real app, you'd use a proper pathfinding algorithm
  const waypoints = [
    { x: start.x, y: start.y },
    { x: start.x, y: end.y },
    { x: end.x, y: end.y }
  ]
  
  // Add some intermediate points to make the path smoother
  const smoothPath = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const current = waypoints[i]
    const next = waypoints[i + 1]
    
    smoothPath.push(current)
    
    // Add intermediate points
    if (i < waypoints.length - 1) {
      const midPoint = {
        x: (current.x + next.x) / 2,
        y: (current.y + next.y) / 2
      }
      smoothPath.push(midPoint)
    }
  }
  
  smoothPath.push(waypoints[waypoints.length - 1])
  navigationPath.value = smoothPath
}

// Clear navigation
const clearNavigation = () => {
  showNavigation.value = false
  navigationTarget.value = null
  navigationPath.value = []
}

// Create SVG path string from waypoints
const navigationPathString = computed(() => {
  if (navigationPath.value.length === 0) return ''
  
  let path = `M ${navigationPath.value[0].x} ${navigationPath.value[0].y}`
  
  for (let i = 1; i < navigationPath.value.length; i++) {
    path += ` L ${navigationPath.value[i].x} ${navigationPath.value[i].y}`
  }
  
  return path
})

// Setup event listeners for dragging outside the element
onMounted(() => {
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
  
  // Restore saved positions if any
  if (Object.keys(savedPositions.value).length > 0) {
    Object.keys(rooms.value).forEach(floorKey => {
      const floor = parseInt(floorKey)
      rooms.value[floor].forEach(room => {
        const positionKey = `${floor}-${room.id}`
        if (savedPositions.value[positionKey]) {
          room.position = { ...savedPositions.value[positionKey] }
        }
      })
    })
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
})
</script>

<template>
  <div class="spaces-page">
    <div class="page-header">
      <div class="header-left">
        <h1>Space Maps</h1>
        <p>{{ floors.find(f => f.id === currentFloor).description }}</p>
      </div>
      
      <div class="header-actions">
        <div class="filter-container">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search spaces..."
            />
          </div>
          
          <select v-model="selectedFilter" class="filter-select">
            <option v-for="filter in filters" 
                    :key="filter.value" 
                    :value="filter.value">
              {{ filter.label }}
            </option>
          </select>
        </div>
        
        <button :class="['action-btn', { active: dragMode }]" @click="toggleDragMode">
          <i class="fas fa-arrows-alt"></i> Layout Editor
        </button>
        
        <button :class="['action-btn', { active: isEditMode }]" @click="toggleEditMode">
          <i class="fas fa-edit"></i> Edit Mode
        </button>
        
        <button :class="['action-btn', { active: showAnalytics }]" @click="toggleAnalytics">
          <i class="fas fa-chart-pie"></i> Analytics
        </button>
      </div>
    </div>

    <div class="map-container">
      <div class="sidebar-tools">
        <div class="floor-selector">
          <button 
            v-for="floor in floors" 
            :key="floor.id"
            :class="['floor-btn', { active: currentFloor === floor.id }]"
            @click="currentFloor = floor.id">
            {{ floor.name }}
            <span class="room-count">{{ floor.roomCount }}</span>
          </button>
        </div>
        
        <div class="legend">
          <h3>Legend</h3>
          <div class="legend-item">
            <span class="legend-color status-available"></span>
            <span>Available</span>
          </div>
          <div class="legend-item">
            <span class="legend-color status-occupied"></span>
            <span>Occupied</span>
          </div>
          <div class="legend-item">
            <span class="legend-color status-maintenance"></span>
            <span>Maintenance</span>
          </div>
          <div class="legend-item">
            <i class="fas fa-walking legend-icon"></i>
            <span>Corridor</span>
          </div>
          <div class="legend-item">
            <i class="fas fa-elevator legend-icon"></i>
            <span>Facility</span>
          </div>
        </div>
        
        <div class="stats-panel">
          <h3>Floor Statistics</h3>
          <div class="stat-item">
            <span class="stat-label">Utilization:</span>
            <span class="stat-value">{{ floorUtilization.utilization }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Available:</span>
            <span class="stat-value">{{ floorUtilization.available }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Occupied:</span>
            <span class="stat-value">{{ floorUtilization.occupied }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Maintenance:</span>
            <span class="stat-value">{{ floorUtilization.maintenance }}</span>
          </div>
        </div>
      </div>
      
      <div class="map-view">
        <div class="map-controls">
          <button class="control-btn" @click="zoomIn">
            <i class="fas fa-search-plus"></i>
          </button>
          <button class="control-btn" @click="resetZoom">
            <i class="fas fa-compress-arrows-alt"></i>
          </button>
          <button class="control-btn" @click="zoomOut">
            <i class="fas fa-search-minus"></i>
          </button>
        </div>
        
        <div class="floor-map" @click="handleMapClick" :style="{ transform: `scale(${mapScale})` }">
          <!-- Corridors -->
          <div 
            v-for="(corridor, idx) in corridors[currentFloor]" 
            :key="`corridor-${idx}`"
            class="corridor"
            :style="{
              left: `${Math.min(corridor.start.x, corridor.end.x)}px`,
              top: `${Math.min(corridor.start.y, corridor.end.y)}px`,
              width: corridor.start.x === corridor.end.x 
                ? `${corridor.width}px` 
                : `${Math.abs(corridor.end.x - corridor.start.x)}px`,
              height: corridor.start.y === corridor.end.y 
                ? `${corridor.width}px` 
                : `${Math.abs(corridor.end.y - corridor.start.y)}px`
            }">
          </div>
          
          <!-- Facilities -->
          <div 
            v-for="(facility, idx) in facilities[currentFloor]" 
            :key="`facility-${idx}`"
            class="facility"
            :style="{
              left: `${facility.position.x}px`,
              top: `${facility.position.y}px`,
              width: `${facility.width}px`,
              height: `${facility.height}px`
            }">
            <i :class="getIcon(facility.type)"></i>
            <span class="facility-label">{{ facility.type }}</span>
          </div>
          
          <!-- Navigation path -->
          <svg class="navigation-layer" v-if="showNavigation">
            <path 
              :d="navigationPathString" 
              class="navigation-path"
              stroke="#3b82f6" 
              stroke-width="3" 
              fill="none" 
              stroke-dasharray="10,5"
            />
            
            <!-- User position marker -->
            <circle 
              :cx="userPosition.x" 
              :cy="userPosition.y" 
              r="8" 
              fill="#3b82f6" 
              class="user-position"
            />
            
            <!-- Destination marker -->
            <circle 
              v-if="navigationTarget"
              :cx="navigationTarget.position.x + (navigationTarget.width / 2)" 
              :cy="navigationTarget.position.y + (navigationTarget.height / 2)" 
              r="8" 
              fill="#ef4444" 
              class="destination-marker"
            />
          </svg>
          
          <!-- Rooms -->
          <div 
            v-for="room in filteredRooms" 
            :key="room.id"
            class="room"
            :class="[
              getRoomStatusClass(room.status),
              { 'room-moving': movingRoomId === room.id || draggedRoom === room },
              { 'room-draggable': dragMode },
              { 'dragging': draggedRoom === room }
            ]"
            :style="{
              left: `${room.position.x}px`,
              top: `${room.position.y}px`,
              width: `${room.width}px`,
              height: `${room.height}px`,
              cursor: dragMode ? 'move' : 'pointer',
              zIndex: draggedRoom === room ? 100 : 5
            }"
            @click.stop="selectRoom(room)"
            @mousedown.stop="startDrag(room, $event)">
            <div class="room-icon">
              <i :class="getIcon(room.type)"></i>
            </div>
            <div class="room-label">{{ room.name }}</div>
            <div v-if="room.status === 'occupied'" class="occupancy-indicator">
              <i class="fas fa-user"></i>
            </div>
            <button class="locate-btn" @click.stop="locateRoom(room)" title="Navigate to this room">
              <i class="fas fa-location-arrow"></i>
            </button>
            <div class="drag-handle" v-if="dragMode">
              <i class="fas fa-grip-lines"></i>
            </div>
          </div>
          
          <!-- North indicator -->
          <div class="compass">
            <i class="fas fa-compass"></i>
            <span>N</span>
          </div>
          
          <!-- Grid lines -->
          <div class="grid-lines">
            <div v-for="i in 12" :key="`h-${i}`" class="grid-line horizontal" :style="{ top: `${i * 50}px` }"></div>
            <div v-for="i in 15" :key="`v-${i}`" class="grid-line vertical" :style="{ left: `${i * 50}px` }"></div>
          </div>
        </div>
        
        <!-- Navigation controls -->
        <div v-if="showNavigation" class="navigation-controls">
          <div class="navigation-info">
            <i class="fas fa-route"></i>
            <span>Navigating to {{ navigationTarget?.name }}</span>
          </div>
          <button class="control-btn" @click="clearNavigation">
            <i class="fas fa-times"></i> Clear Route
          </button>
        </div>
        
        <!-- Drag mode indicator -->
        <div v-if="dragMode" class="drag-mode-indicator">
          <i class="fas fa-arrows-alt"></i> Drag Mode Enabled
          <span class="drag-hint">Drag rooms to reposition them</span>
        </div>
        
        <div v-if="isEditMode" class="edit-mode-indicator">
          <i class="fas fa-edit"></i> Edit Mode {{ isMovingRoom ? '- Click to place room' : '' }}
        </div>
      </div>
      
      <div v-if="showAnalytics" class="analytics-panel">
        <button class="close-btn" @click="showAnalytics = false">×</button>
        <h3>Floor Analytics</h3>
        <div class="analytics-content">
          <div class="chart-container">
            <h4>Hourly Usage</h4>
            <!-- Placeholder for chart -->
            <div class="chart-placeholder"></div>
          </div>
          
          <div class="heatmap-container">
            <h4>Occupancy Heatmap</h4>
            <!-- Placeholder for heatmap -->
            <div class="heatmap-placeholder"></div>
          </div>
          
          <div class="insights">
            <h4>Insights</h4>
            <ul>
              <li>Peak usage time: 10:00 AM - 11:30 AM</li>
              <li>Most used room: Conference Room 102</li>
              <li>Average meeting duration: 45 minutes</li>
              <li>Underutilized rooms: Office 105, Studio 108</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Details Modal -->
    <div class="room-details-modal" v-if="showRoomDetails" @click.self="closeRoomDetails">
      <div class="modal-content">
        <button class="close-btn" @click="closeRoomDetails">×</button>
        
        <div class="modal-header">
          <h3>{{ selectedRoom.name }}</h3>
          <span :class="['status-badge', getRoomStatusClass(selectedRoom.status)]">
            {{ selectedRoom.status }}
          </span>
        </div>
        
        <div class="room-details-grid">
          <div class="detail-section">
            <h4>Room Details</h4>
            <div class="detail-item">
              <i class="fas fa-id-badge"></i>
              <span>Room {{ selectedRoom.id }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <span>Capacity: {{ selectedRoom.capacity }} people</span>
            </div>
            <div class="detail-item">
              <i :class="getIcon(selectedRoom.type)"></i>
              <span>Type: {{ selectedRoom.type }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Environment</h4>
            <div class="detail-item">
              <i class="fas fa-thermometer-half"></i>
              <span>Temperature: {{ selectedRoom.temperature }}°F</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-lightbulb"></i>
              <span>Lighting: {{ selectedRoom.lightLevel }}%</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-chart-line"></i>
              <span>Occupancy Rate: {{ selectedRoom.occupancyRate }}%</span>
            </div>
          </div>
          
          <div class="detail-section equipment-list">
            <h4>Equipment</h4>
            <ul>
              <li v-for="(item, idx) in selectedRoom.equipment" :key="idx">
                <i class="fas fa-check"></i> {{ item }}
              </li>
            </ul>
          </div>
          
          <div class="detail-section">
            <h4>Schedule</h4>
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>Next booking: {{ selectedRoom.nextBooking }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="action-btn book-btn" @click="scheduleRoom(selectedRoom.id)">
            <i class="fas fa-calendar-plus"></i> Book Now
          </button>
          <button class="action-btn details-btn" @click="router.push(`/admin/boardrooms/${selectedRoom.id}`)">
            <i class="fas fa-info-circle"></i> Full Details
          </button>
        </div>
      </div>
    </div>
    
    <!-- Save changes confirmation -->
    <div v-if="Object.keys(savedPositions).length > 0" class="save-changes-bar">
      <span><i class="fas fa-info-circle"></i> You have unsaved layout changes</span>
      <div class="save-actions">
        <button class="save-btn" @click="saveLayout">
          <i class="fas fa-save"></i> Save Layout
        </button>
        <button class="discard-btn" @click="discardChanges">
          <i class="fas fa-undo"></i> Reset
        </button>
      </div>
    </div>
    
    <!-- Drag mode tutorial -->
    <div v-if="showDragTutorial" class="drag-tutorial">
      <div class="tutorial-content">
        <h3><i class="fas fa-info-circle"></i> Layout Editor</h3>
        <p>You're now in Layout Editor mode:</p>
        <ul>
          <li>Click and drag rooms to reposition them on the floor plan</li>
          <li>Drag rooms to corridors to create logical layouts</li>
          <li>Use the save button to persist your changes</li>
        </ul>
        <button class="dismiss-btn" @click="showDragTutorial = false">Got it</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spaces-page {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.header-left p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.filter-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 200px;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: white;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
}

.action-btn.active {
  background: #3b82f6;
  color: white;
}

.action-btn:hover:not(.active) {
  background: #e5e7eb;
}

.map-container {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.sidebar-tools {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.floor-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.floor-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.floor-btn.active {
  background: #3b82f6;
  color: white;
}

.room-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.legend {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.legend h3 {
  margin-top: 0;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-icon {
  width: 16px;
  text-align: center;
  color: #64748b;
}

.stats-panel {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stats-panel h3 {
  margin-top: 0;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.stat-value {
  font-weight: 600;
}

.map-view {
  flex: 1;
  position: relative;
}

.map-controls {
  position: absolute;
  right: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.control-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f3f4f6;
}

.floor-map {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 600px;
  position: relative;
  overflow: hidden;
  transform-origin: top left;
  transition: transform 0.3s ease;
}

.corridor {
  position: absolute;
  background: #f3f4f6;
  z-index: 2;
  border-radius: 4px;
}

.facility {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px dashed #94a3b8;
  border-radius: 4px;
  z-index: 3;
  padding: 0.25rem;
  font-size: 1.25rem;
  color: #64748b;
  cursor: default;
}

.facility-label {
  font-size: 0.625rem;
  margin-top: 0.25rem;
  text-transform: capitalize;
}

.room {
  position: absolute;
  border: 2px solid;
  border-radius: 4px;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 5;
}

.room:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.room-moving {
  opacity: 0.7;
  border-style: dashed;
}

.status-available {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

.status-occupied {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.status-maintenance {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.room-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.room-label {
  font-size: 0.75rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.occupancy-indicator {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.compass {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: white;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  z-index: 10;
}

.compass i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.compass span {
  font-size: 0.75rem;
  color: #1a1a1a;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.grid-line {
  position: absolute;
  background: rgba(229, 231, 235, 0.5);
}

.horizontal {
  width: 100%;
  height: 1px;
}

.vertical {
  height: 100%;
  width: 1px;
}

.edit-mode-indicator {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #1a1a1a;
}

.analytics-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 20;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.analytics-panel .close-btn {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.analytics-panel h3 {
  margin-top: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.analytics-content {
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;
}

.chart-container,
.heatmap-container {
  margin-bottom: 1.5rem;
}

.chart-placeholder,
.heatmap-placeholder {
  height: 200px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.insights {
  margin-top: 1rem;
}

.insights h4 {
  font-size: 1rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.insights ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.insights li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.room-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 400px;
  max-width: 90%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.status-available {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-occupied {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-maintenance {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.room-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.detail-section {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
}

.detail-section h4 {
  margin-top: 0;
  font-size: 1rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.equipment-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.equipment-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.book-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.details-btn {
  background: white;
  border: 1px solid #e5e7eb;
}

.room-draggable {
  cursor: move !important;
  transition: none; /* Disable transition while dragging */
  position: relative;
}

.room-draggable:hover {
  box-shadow: 0 0 0 2px #3b82f6, 0 4px 6px rgba(0,0,0,0.1);
}

.room-draggable::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed transparent;
  border-radius: 4px;
  pointer-events: none;
}

.room-draggable:hover::before {
  border-color: #3b82f6;
  animation: pulse-border 2s infinite;
}

.dragging {
  opacity: 0.8;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
  z-index: 100 !important;
}

.drag-handle {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  padding: 2px;
  opacity: 0.7;
  font-size: 0.75rem;
  color: #3b82f6;
}

.room:hover .drag-handle {
  opacity: 1;
}

@keyframes pulse-border {
  0% {
    border-color: rgba(59, 130, 246, 0.5);
  }
  50% {
    border-color: rgba(59, 130, 246, 1);
  }
  100% {
    border-color: rgba(59, 130, 246, 0.5);
  }
}

.drag-tutorial {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  z-index: 200;
  animation: slide-in 0.3s ease;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.tutorial-content h3 {
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e40af;
}

.tutorial-content p {
  margin-bottom: 0.75rem;
}

.tutorial-content ul {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.tutorial-content li {
  margin-bottom: 0.5rem;
}

.dismiss-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
}

.save-changes-bar {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 50;
  min-width: 400px;
  animation: bounce-in 0.3s ease;
}

@keyframes bounce-in {
  0% {
    transform: translate(-50%, 100%);
  }
  50% {
    transform: translate(-50%, -10%);
  }
  100% {
    transform: translate(-50%, 0);
  }
}
</style>
