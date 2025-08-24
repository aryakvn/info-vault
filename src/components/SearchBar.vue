<template>
  <div class="relative mb-6">
            <input 
          type="text" 
          :value="searchTerm"
          @input="$emit('search-change', $event.target.value)"
          placeholder="Search..." 
          class="w-full py-3 px-4 input-field focus:outline-none transition-all duration-200 focus:scale-[1.02]"
        >
    <i class="fas fa-search absolute right-4 top-3.5 text-gray-400"></i>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  searchTerm: {
    type: String,
    default: ''
  }
})

defineEmits(['search-change'])
</script>


