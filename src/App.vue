<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <!-- Offline Indicator -->
    <OfflineIndicator />
    <div class="container mx-auto px-4 py-8 max-w-md">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-dark">InfoVault</h1>
          <p class="text-sm text-gray-500">Your secure information storage</p>
        </div>
        <button 
          @click="openAddModal"
          class="neumorphic-btn w-12 h-12 flex items-center justify-center text-primary transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <i class="fas fa-plus text-xl"></i>
        </button>
      </header>
      
      <!-- Tabs -->
      <TabBar 
        :current-tab="currentTab"
        @tab-change="handleTabChange"
      />
      
      <!-- Search -->
      <SearchBar 
        :search-term="searchTerm"
        @search-change="handleSearchChange"
      />
      
      <!-- Info Cards -->
      <TransitionGroup 
        v-if="filteredInfos.length > 0" 
        name="card-list" 
        tag="div" 
        class="space-y-4"
      >
        <InfoCard
          v-for="(info, index) in filteredInfos"
          :key="info.id"
          :info="info"
          :data-index="index"
          @card-click="openViewModal"
        />
      </TransitionGroup>
      
      <!-- No Results State -->
      <div 
        v-else-if="searchTerm || currentTab !== 'all'"
        class="text-center py-8"
      >
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-dark mb-2">No results found</h3>
        <p class="text-gray-500">Try adjusting your search or filter</p>
      </div>
      
      <!-- Empty State -->
      <EmptyState 
        v-else
        @add-first="openAddModal"
      />
    </div>
    
    <!-- Add/Edit Info Modal -->
    <AddInfoModal
      :is-open="isAddModalOpen"
      :editing-info="editingInfo"
      @close="closeAddModal"
      @save="handleSaveInfo"
    />
    
    <!-- View Info Modal -->
    <ViewInfoModal
      :is-open="isViewModalOpen"
      :info="viewingInfo"
      @close="closeViewModal"
      @edit="handleEditInfo"
      @delete="handleDeleteInfo"
      @toast="showToast"
    />
    
    <!-- Toast Notification -->
    <Toast ref="toastRef" />
    
    <!-- PWA Install Prompt -->
    <PWAInstallPrompt />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TabBar from './components/TabBar.vue'
import SearchBar from './components/SearchBar.vue'
import InfoCard from './components/InfoCard.vue'
import EmptyState from './components/EmptyState.vue'
import AddInfoModal from './components/AddInfoModal.vue'
import ViewInfoModal from './components/ViewInfoModal.vue'
import Toast from './components/Toast.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'

// State
const currentTab = ref('all')
const searchTerm = ref('')
const infos = ref([])
const isAddModalOpen = ref(false)
const isViewModalOpen = ref(false)
const editingInfo = ref(null)
const viewingInfo = ref(null)
const toastRef = ref(null)

// Computed
const filteredInfos = computed(() => {
  let filtered = [...infos.value]
  
  // Filter by tab
  if (currentTab.value !== 'all') {
    filtered = filtered.filter(info => {
      if (currentTab.value === 'personal') {
        return info.type === 'phone' || info.type === 'postal'
      } else if (currentTab.value === 'financial') {
        return info.type === 'credit' || info.type === 'wallet'
      }
      return true
    })
  }
  
  // Filter by search
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(info => {
      if (info.type === 'credit') {
        return (
          info.cardName.toLowerCase().includes(term) ||
          info.cardNumber.includes(term) ||
          (info.label && info.label.toLowerCase().includes(term))
        )
      } else if (info.type === 'wallet') {
        return (
          info.walletName.toLowerCase().includes(term) ||
          info.publicAddress.toLowerCase().includes(term) ||
          info.mnemonicPhrase.toLowerCase().includes(term) ||
          (info.label && info.label.toLowerCase().includes(term))
        )
      } else if (info.type === 'other') {
        return (
          info.title.toLowerCase().includes(term) ||
          info.value.toLowerCase().includes(term) ||
          (info.label && info.label.toLowerCase().includes(term))
        )
      } else {
        return (
          info.value.includes(term) ||
          (info.label && info.label.toLowerCase().includes(term))
        )
      }
    })
  }
  
  return filtered
})

// Methods
function handleTabChange(tab) {
  currentTab.value = tab
}

function handleSearchChange(term) {
  searchTerm.value = term
}

function openAddModal() {
  isAddModalOpen.value = true
  editingInfo.value = null
}

function openEditModal(info) {
  editingInfo.value = { ...info }
  isAddModalOpen.value = true
}

function closeAddModal() {
  isAddModalOpen.value = false
  editingInfo.value = null
}

function openViewModal(id) {
  viewingInfo.value = infos.value.find(item => item.id === id)
  isViewModalOpen.value = true
}

function closeViewModal() {
  isViewModalOpen.value = false
  viewingInfo.value = null
}

function handleSaveInfo(info) {
  if (editingInfo.value) {
    // Update existing info
    const index = infos.value.findIndex(item => item.id === info.id)
    if (index !== -1) {
      infos.value[index] = { ...info }
    }
  } else {
    // Add new info
    infos.value.unshift(info)
  }
  
  saveInfos()
  closeAddModal()
  showToast('Information saved successfully')
}

function handleEditInfo(info) {
  closeViewModal()
  openEditModal(info)
}

function handleDeleteInfo(id) {
  infos.value = infos.value.filter(item => item.id !== id)
  saveInfos()
  closeViewModal()
  showToast('Information deleted')
}

function saveInfos() {
  localStorage.setItem('infos', JSON.stringify(infos.value))
}

function loadInfos() {
  const saved = localStorage.getItem('infos')
  if (saved) {
    infos.value = JSON.parse(saved)
  }
}

function showToast(message) {
  if (toastRef.value) {
    toastRef.value.show(message)
  }
}

// Lifecycle
onMounted(() => {
  loadInfos()
})
</script>

<style>
@media (max-width: 640px) {
  .container {
    max-width: 100%;
  }
}

/* Card list transitions */
.card-list-enter-active {
  transition: all 0.5s ease;
}

.card-list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.card-list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.card-list-move {
  transition: transform 0.3s ease;
}

/* Staggered animation for cards */
.card-list-enter-active:nth-child(1) { transition-delay: 0.1s; }
.card-list-enter-active:nth-child(2) { transition-delay: 0.2s; }
.card-list-enter-active:nth-child(3) { transition-delay: 0.3s; }
.card-list-enter-active:nth-child(4) { transition-delay: 0.4s; }
.card-list-enter-active:nth-child(5) { transition-delay: 0.5s; }
</style>