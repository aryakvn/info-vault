<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      @click.self="$emit('close')">
      <Transition name="modal-content" appear>
        <div class="neumorphic w-full max-w-md p-6 rounded-xl">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-dark">
              {{ isEditing ? 'Edit Information' : 'Add New Information' }}
            </h2>
            <button @click="$emit('close')"
              class="neumorphic-btn w-10 h-10 flex items-center justify-center text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="infoType" class="block text-sm font-medium text-gray-600 mb-1">Information Type</label>
              <select id="infoType" v-model="formData.type" @change="handleTypeChange"
                class="w-full py-2 px-4 input-field focus:outline-none">
                <option value="phone">Phone Number</option>
                <option value="postal">Postal Code</option>
                <option value="credit">Credit Card</option>
                <option value="wallet">Wallet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Credit Card Fields -->
            <div v-if="formData.type === 'credit'" class="space-y-4">
              <div>
                <label for="cardName" class="block text-sm font-medium text-gray-600 mb-1">Cardholder Name</label>
                <input type="text" id="cardName" v-model="formData.cardName"
                  class="w-full py-2 px-4 input-field focus:outline-none" required>
              </div>
              <div>
                <label for="cardNumber" class="block text-sm font-medium text-gray-600 mb-1">Card Number</label>
                <input type="text" id="cardNumber" v-model="formData.cardNumber"
                  class="w-full py-2 px-4 input-field focus:outline-none" required>
              </div>
                          <div class="grid grid-cols-2 gap-4">
              <div class="sensitive-field">
                <label for="expiryDate" class="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                <div class="relative">
                  <input 
                    :type="showExpiry ? 'text' : 'password'" 
                    id="expiryDate" 
                    v-model="formData.expiryDate" 
                    placeholder="MM/YY"
                    :class="[
                      'w-full py-2 px-4 pr-12 input-field focus:outline-none',
                      { 'blur-sm': !showExpiry }
                    ]"
                    required
                  >
                  <button 
                    type="button"
                    @click="showExpiry = !showExpiry"
                    class="hide-show-btn absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i :class="showExpiry ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="sensitive-field">
                <label for="cvv" class="block text-sm font-medium text-gray-600 mb-1">CVV</label>
                <div class="relative">
                  <input 
                    :type="showCvv ? 'text' : 'password'" 
                    id="cvv" 
                    v-model="formData.cvv"
                    :class="[
                      'w-full py-2 px-4 pr-12 input-field focus:outline-none',
                      { 'blur-sm': !showCvv }
                    ]"
                    required
                  >
                  <button 
                    type="button"
                    @click="showCvv = !showCvv"
                    class="hide-show-btn absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i :class="showCvv ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
            </div>
            </div>

            <!-- Wallet Fields -->
            <div v-if="formData.type === 'wallet'" class="space-y-4">
              <div>
                <label for="walletName" class="block text-sm font-medium text-gray-600 mb-1">Wallet Name</label>
                <input type="text" id="walletName" v-model="formData.walletName"
                  placeholder="e.g. Bitcoin, Ethereum, MetaMask" class="w-full py-2 px-4 input-field focus:outline-none"
                  required>
              </div>
              <div>
                <label for="publicAddress" class="block text-sm font-medium text-gray-600 mb-1">Public Address</label>
                <input type="text" id="publicAddress" v-model="formData.publicAddress" placeholder="0x... or bc1..."
                  class="w-full py-2 px-4 input-field focus:outline-none" required>
              </div>
              <div>
                <label for="mnemonicLength" class="block text-sm font-medium text-gray-600 mb-1">Mnemonic Length</label>
                <select id="mnemonicLength" v-model="formData.mnemonicLength"
                  class="w-full py-2 px-4 input-field focus:outline-none" required>
                  <option value="12">12 words</option>
                  <option value="24">24 words</option>
                </select>
              </div>
                          <div class="sensitive-field">
              <label for="mnemonicPhrase" class="block text-sm font-medium text-gray-600 mb-1">Mnemonic Phrase</label>
              <div class="relative">
                <textarea 
                  id="mnemonicPhrase" 
                  v-model="formData.mnemonicPhrase"
                  :placeholder="`Enter ${formData.mnemonicLength || 12} words separated by spaces`" 
                  rows="3"
                  :class="[
                    'w-full py-2 px-4 pr-12 input-field focus:outline-none resize-none',
                    { 'blur-sm': !showMnemonic }
                  ]"
                  required
                ></textarea>
                <button 
                  type="button"
                  @click="showMnemonic = !showMnemonic"
                  class="hide-show-btn absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i :class="showMnemonic ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            </div>

            <!-- Phone Fields -->
            <div v-if="formData.type === 'phone'">
              <label for="phoneNumber" class="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input type="tel" id="phoneNumber" v-model="formData.value"
                class="w-full py-2 px-4 input-field focus:outline-none" required>
            </div>

            <!-- Postal Fields -->
            <div v-if="formData.type === 'postal'">
              <label for="postalCode" class="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
              <input type="tel" id="postalCode" v-model="formData.value"
                class="w-full py-2 px-4 input-field focus:outline-none" required>
            </div>

            <!-- Other Fields -->
            <div v-if="formData.type === 'other'" class="space-y-4">
              <div>
                <label for="otherTitle" class="block text-sm font-medium text-gray-600 mb-1">Title</label>
                <input type="text" id="otherTitle" v-model="formData.title"
                  class="w-full py-2 px-4 input-field focus:outline-none" required>
              </div>
              <div>
                <label for="otherValue" class="block text-sm font-medium text-gray-600 mb-1">Value</label>
                <input type="text" id="otherValue" v-model="formData.value"
                  class="w-full py-2 px-4 input-field focus:outline-none" required>
              </div>
            </div>

            <div>
              <label for="infoLabel" class="block text-sm font-medium text-gray-600 mb-1">Label (optional)</label>
              <input type="text" id="infoLabel" v-model="formData.label" placeholder="e.g. Work phone, Home address"
                class="w-full py-2 px-4 input-field focus:outline-none">
            </div>

            <div class="pt-4 flex justify-end space-x-3">
              <button type="button" @click="$emit('close')" class="neumorphic-btn px-6 py-2 text-gray-600 font-medium">
                Cancel
              </button>
              <button type="submit" class="neumorphic-btn px-6 py-2 bg-primary text-white font-medium">
                {{ isEditing ? 'Update' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, reactive, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingInfo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.editingInfo)

// Hide/Show states for sensitive fields
const showExpiry = ref(false)
const showCvv = ref(false)
const showMnemonic = ref(false)

const formData = reactive({
  type: 'phone',
  value: '',
  title: '',
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  walletName: '',
  publicAddress: '',
  mnemonicLength: '12',
  mnemonicPhrase: '',
  label: ''
})

// Watch for editingInfo changes to populate form
watch(() => props.editingInfo, (newInfo) => {
  if (newInfo) {
    Object.assign(formData, newInfo)
  } else {
    resetForm()
  }
}, { immediate: true });

watch(() => props.isOpen, (newVal) => {
  console.log('isOpen', newVal)
  console.log('editingInfo', props.editingInfo)
  if (newVal) {
    resetForm()
  }
})

function handleTypeChange() {
  // Reset form fields when type changes
  formData.value = ''
  formData.title = ''
  formData.cardName = ''
  formData.cardNumber = ''
  formData.expiryDate = ''
  formData.cvv = ''
  formData.walletName = ''
  formData.publicAddress = ''
  formData.mnemonicLength = '12'
  formData.mnemonicPhrase = ''
}

function handleSubmit() {
  const newInfo = { ...formData }

  if (props.editingInfo) {
    newInfo.id = props.editingInfo.id
    newInfo.createdAt = props.editingInfo.createdAt
  } else {
    newInfo.id = Date.now().toString()
    newInfo.createdAt = new Date().toISOString()
  }

  emit('save', newInfo)
  resetForm()
}

function resetForm() {
  Object.assign(formData, {
    type: 'phone',
    value: '',
    title: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    walletName: '',
    publicAddress: '',
    mnemonicLength: '12',
    mnemonicPhrase: '',
    label: ''
  })
  
  // Reset hide/show states
  showExpiry.value = false
  showCvv.value = false
  showMnemonic.value = false
}
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
