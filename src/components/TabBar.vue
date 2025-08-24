<template>
  <div class="flex mb-6 bg-gray-100 p-1 rounded-xl neumorphic">
            <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :data-tab="tab.id"
          @click="$emit('tab-change', tab.id)"
          :class="[
            'tab-btn flex-1 py-2 px-4 rounded-lg font-medium text-gray-600 transition-all duration-200',
            { 'tab-active': currentTab === tab.id }
          ]"
        >
          {{ tab.label }}
        </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['tab-change'])

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'personal', label: 'Personal' },
  { id: 'financial', label: 'Financial' }
]
</script>

<style scoped>
.tab-active {
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
  box-shadow: inset 4px 4px 8px #d9d9d9,
              inset -4px -4px 8px #ffffff;
  color: #6366f1;
}
</style>
