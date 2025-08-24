<template>
  <Transition name="offline-indicator">
    <div 
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 px-4 z-50"
    >
      <div class="flex items-center justify-center space-x-2">
        <i class="fas fa-wifi-slash"></i>
        <span class="text-sm font-medium">You're offline - InfoVault is working locally</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Listen for service worker messages
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage)
  }
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage)
  }
})

function handleOnline() {
  isOnline.value = true
}

function handleOffline() {
  isOnline.value = false
}

function handleServiceWorkerMessage(event) {
  if (event.data.type === 'ONLINE_STATUS') {
    isOnline.value = event.data.online
  }
}
</script>

<style scoped>
.offline-indicator-enter-active,
.offline-indicator-leave-active {
  transition: all 0.3s ease;
}

.offline-indicator-enter-from,
.offline-indicator-leave-to {
  transform: translateY(-100%);
}
</style>
