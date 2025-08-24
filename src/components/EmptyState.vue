<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="neumorphic w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
      <i class="fas fa-info-circle text-3xl text-primary"></i>
    </div>
    <h3 class="text-lg font-medium text-dark mb-2">No information saved</h3>
    <p class="text-gray-500 text-center mb-4">Add your first information by clicking the + button</p>
    <button 
      @click="$emit('add-first')"
      class="neumorphic-btn px-6 py-2 text-primary font-medium"
    >
      Add Information
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

defineEmits(['add-first'])
</script>


