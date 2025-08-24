<template>
  <Transition name="toast" appear>
    <div 
      v-if="isVisible"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-100"
    >
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineExpose, ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})

const isVisible = ref(false)

function show(message, duration = 3000) {
  props.message = message
  isVisible.value = true
  
  setTimeout(() => {
    isVisible.value = false
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 30px) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 30px) scale(0.9);
}
</style>
