<script setup lang="ts">
const model = defineModel<string>({ required: true })

const { 
  placeholder = 'Search...', 
  disabled = false,
  autofocus = false 
} = defineProps<{
  placeholder?: string
  disabled?: boolean
  autofocus?: boolean
}>()

const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const searchId = useId()

const clearValue = () => {
  model.value = ''
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && model.value) {
    event.preventDefault()
    clearValue()
  }
}

onMounted(() => {
  if (autofocus) {
    searchInputRef.value?.focus()
  }
})
</script>

<template>
  <div class="relative group" role="search">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
      <svg 
        class="w-5 h-5 transition-colors duration-200 text-gray-400 group-focus-within:text-blue-400"
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
      :id="searchId"
      ref="searchInputRef"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-describedby="model ? `${searchId}-clear` : undefined"
      type="text"
      role="searchbox"
      aria-label="Search input"
      class="w-full pl-12 pr-12 py-3.5 text-white placeholder-gray-400 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-800/80 hover:border-gray-500/50"
      @keydown="handleKeydown"
    >

    <button
      v-if="model"
      :id="`${searchId}-clear`"
      type="button"
      class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white focus:text-white transition-colors duration-200 focus:outline-none"
      aria-label="Clear search input"
      @click="clearValue"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template> 