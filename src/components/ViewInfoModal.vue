<template>
  <Transition name="modal">
    <div 
      v-if="isOpen && info"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      @click.self="$emit('close')"
    >
      <Transition name="modal-content" appear>
        <div class="neumorphic w-full max-w-md p-6 rounded-xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-dark">{{ getInfoTitle(info) }}</h2>
        <button 
          @click="$emit('close')"
          class="neumorphic-btn w-10 h-10 flex items-center justify-center text-gray-500"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-4 mb-6">
        <!-- Credit Card Info -->
        <div v-if="info.type === 'credit'" class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Cardholder:</span>
            <span class="font-medium">{{ info.cardName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Card Number:</span>
            <span class="font-medium">{{ formatCardNumber(info.cardNumber) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Expiry Date:</span>
            <div class="flex items-center space-x-2">
              <span :class="['font-medium', { 'blur-sm': !showExpiry }]">{{ info.expiryDate }}</span>
              <button 
                @click="showExpiry = !showExpiry"
                class="hide-show-btn text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i :class="showExpiry ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">CVV:</span>
            <div class="flex items-center space-x-2">
              <span :class="['font-medium', { 'blur-sm': !showCvv }]">{{ info.cvv }}</span>
              <button 
                @click="showCvv = !showCvv"
                class="hide-show-btn text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i :class="showCvv ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Wallet Info -->
        <div v-else-if="info.type === 'wallet'" class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Wallet Name:</span>
            <span class="font-medium">{{ info.walletName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Public Address:</span>
            <span class="font-medium text-xs break-all">{{ info.publicAddress }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mnemonic Length:</span>
            <span class="font-medium">{{ info.mnemonicLength }} words</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mnemonic Phrase:</span>
            <div class="flex items-center space-x-2 max-w-xs">
              <span :class="['font-medium text-xs break-all', { 'blur-sm': !showMnemonic }]">{{ info.mnemonicPhrase }}</span>
              <button 
                @click="showMnemonic = !showMnemonic"
                class="hide-show-btn text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
              >
                <i :class="showMnemonic ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Phone/Postal Info -->
        <div v-else-if="info.type === 'phone' || info.type === 'postal'" class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">
              {{ info.type === 'phone' ? 'Phone Number:' : 'Postal Code:' }}
            </span>
            <span class="font-medium">{{ info.value }}</span>
          </div>
        </div>
        
        <!-- Other Info -->
        <div v-else class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ info.title }}:</span>
            <span class="font-medium">{{ info.value }}</span>
          </div>
        </div>
        
        <!-- Label -->
        <div v-if="info.label" class="flex justify-between">
          <span class="text-gray-600">Label:</span>
          <span class="font-medium">{{ info.label }}</span>
        </div>
      </div>
      
      <div class="flex justify-between pt-4 border-t border-gray-200">
        <button 
          @click="copyInfo"
          class="neumorphic-btn px-4 py-2 text-primary font-medium flex items-center"
        >
          <i class="fas fa-copy mr-2"></i> Copy
        </button>
        <div class="flex space-x-3">
          <button 
            @click="$emit('edit', info)"
            class="neumorphic-btn px-4 py-2 text-secondary font-medium flex items-center"
          >
            <i class="fas fa-edit mr-2"></i> Edit
          </button>
          <button 
            @click="confirmDelete"
            class="neumorphic-btn px-4 py-2 text-red-500 font-medium flex items-center"
          >
            <i class="fas fa-trash mr-2"></i> Delete
          </button>
        </div>
      </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  info: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])

// Hide/Show states for sensitive fields
const showExpiry = ref(false)
const showCvv = ref(false)
const showMnemonic = ref(false)

function getInfoTitle(info) {
  switch (info.type) {
    case 'credit': return 'Credit Card'
    case 'phone': return 'Phone Number'
    case 'postal': return 'Postal Code'
    case 'wallet': return info.walletName || 'Wallet'
    default: return info.title
  }
}

function formatCardNumber(number) {
  return number.replace(/(\d{4})/g, '$1 ').trim()
}

function copyInfo() {
  if (!props.info) return
  
  let textToCopy = ''
  
  if (props.info.type === 'credit') {
    textToCopy = `Cardholder: ${props.info.cardName}\nCard Number: ${props.info.cardNumber}\nExpiry: ${props.info.expiryDate}\nCVV: ${props.info.cvv}`
  } else if (props.info.type === 'wallet') {
    textToCopy = `Wallet: ${props.info.walletName}\nPublic Address: ${props.info.publicAddress}\nMnemonic: ${props.info.mnemonicPhrase}`
  } else if (props.info.type === 'phone' || props.info.type === 'postal') {
    textToCopy = props.info.value
  } else {
    textToCopy = `${props.info.title}: ${props.info.value}`
  }
  
  navigator.clipboard.writeText(textToCopy)
    .then(() => emit('toast', 'Copied to clipboard'))
    .catch(err => emit('toast', 'Failed to copy'))
}

function confirmDelete() {
  if (confirm('Are you sure you want to delete this information?')) {
    emit('delete', props.info.id)
  }
}

// Reset hide/show states when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    showExpiry.value = false
    showCvv.value = false
    showMnemonic.value = false
  }
})
</script>

<style scoped>
/* Modal overlay transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Modal content transitions */
.modal-content-enter-active {
  transition: all 0.3s ease;
  transition-delay: 0.1s;
}

.modal-content-leave-active {
  transition: all 0.2s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>

