<template>
  <Transition name="install-prompt">
    <div 
      v-if="showInstallPrompt"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40"
    >
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i class="fas fa-download text-white"></i>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-900">Install InfoVault</h3>
          <p class="text-xs text-gray-500">Add to home screen for offline access</p>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="installApp"
            class="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
          <button 
            @click="dismissPrompt"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showInstallPrompt = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App is already installed')
    return
  }
  
  // Check if user has previously dismissed the prompt
  const hasDismissed = localStorage.getItem('pwa-install-dismissed')
  if (!hasDismissed) {
    // Show prompt after a delay
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

function handleBeforeInstallPrompt(event) {
  // Prevent the default prompt
  event.preventDefault()
  
  // Store the event for later use
  deferredPrompt.value = event
  
  // Show our custom prompt
  showInstallPrompt.value = true
}

async function installApp() {
  if (deferredPrompt.value) {
    // Show the native install prompt
    deferredPrompt.value.prompt()
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      showInstallPrompt.value = false
    } else {
      console.log('User dismissed the install prompt')
    }
    
    // Clear the deferred prompt
    deferredPrompt.value = null
  } else {
    // Fallback for browsers that don't support beforeinstallprompt
    console.log('Install prompt not available')
    showToast('Installation not available in this browser')
  }
}

function dismissPrompt() {
  showInstallPrompt.value = false
  // Remember that user dismissed the prompt
  localStorage.setItem('pwa-install-dismissed', 'true')
}

function showToast(message) {
  // Emit event to parent for toast display
  // This could be enhanced with a proper toast system
  console.log(message)
}
</script>

<style scoped>
.install-prompt-enter-active,
.install-prompt-leave-active {
  transition: all 0.3s ease;
}

.install-prompt-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.install-prompt-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
