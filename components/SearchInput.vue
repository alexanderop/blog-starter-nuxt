<script setup lang="ts">
import { useTemplateRef, nextTick, useId } from 'vue'

const { 
  modelValue, 
  placeholder = 'Search...', 
  disabled = false,
  autofocus = false 
} = defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  autofocus?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [value: string]
  'clear': []
  'search': [value: string]
}>()

const inputRef = useTemplateRef('inputRef')
const inputId = useId()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => inputRef.value?.focus())
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClear()
  } else if (event.key === 'Enter' && modelValue.trim()) {
    emit('search', modelValue.trim())
  }
}

const focus = () => {
  nextTick(() => inputRef.value?.focus())
}

defineExpose({ focus })
</script>

<template>
  <div class="relative group">
    <label :for="inputId" class="sr-only">Search</label>
    
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
      <svg 
        class="w-5 h-5 transition-colors duration-200"
        :class="[
          modelValue ? 'text-blue-400' : 'text-gray-400',
          'group-focus-within:text-blue-400'
        ]"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </div>

    <input
      :id="inputId"
      ref="inputRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      type="text"
      class="w-full pl-12 pr-12 py-3.5 text-white placeholder-gray-400 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-800/80 hover:border-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
      @input="handleInput"
      @keydown="handleKeydown"
    >

    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <button
        v-if="modelValue && !disabled"
        type="button"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white focus:text-white transition-colors duration-200 focus:outline-none"
        aria-label="Clear search"
        @click="handleClear"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

