<template>
  <div 
    class="neumorphic p-4 card-item cursor-pointer"
    @click="$emit('card-click', info.id)"
  >
    <div class="flex items-start">
      <div class="neumorphic-inset w-12 h-12 rounded-full flex items-center justify-center mr-4">
        <i :class="['fas', iconClass, 'text-xl text-primary']"></i>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h3 class="font-medium text-dark">{{ title }}</h3>
          <span class="text-xs text-gray-500">{{ formatDate(info.createdAt) }}</span>
        </div>
        <p class="text-gray-600 mt-1">{{ displayValue }}</p>
        <span 
          v-if="info.label" 
          class="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
        >
          {{ info.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['card-click'])

const iconClass = computed(() => {
  switch (props.info.type) {
    case 'credit': return 'fa-credit-card'
    case 'phone': return 'fa-phone'
    case 'postal': return 'fa-envelope'
    case 'wallet': return 'fa-wallet'
    default: return 'fa-info-circle'
  }
})

const title = computed(() => {
  switch (props.info.type) {
    case 'credit': return 'Credit Card'
    case 'phone': return 'Phone Number'
    case 'postal': return 'Postal Code'
    case 'wallet': return props.info.walletName || 'Wallet'
    default: return props.info.title
  }
})

const displayValue = computed(() => {
  if (props.info.type === 'credit') {
    return formatCardNumber(props.info.cardNumber)
  } else if (props.info.type === 'wallet') {
    return props.info.publicAddress || 'Wallet Address'
  }
  return props.info.value || props.info.title
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCardNumber(number) {
  return number.replace(/(\d{4})/g, '$1 ').trim()
}
</script>

<style scoped>
.card-item {
  transition: transform 0.2s ease;
}

.card-item:hover {
  transform: translateY(-2px);
}
</style>
