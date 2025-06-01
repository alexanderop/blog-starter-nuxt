<script setup lang="ts">
type SearchMode = 'keyword' | 'fuzzy' | 'semantic' | 'hybrid'

const model = defineModel<SearchMode>({ required: true })

const searchModes = [
  { value: 'keyword' as const, label: 'Keyword', description: 'Exact term matching' },
  { value: 'fuzzy' as const, label: 'Fuzzy', description: 'Approximate matching' },
  { value: 'semantic' as const, label: 'Semantic', description: 'Meaning-based search' },
  { value: 'hybrid' as const, label: 'Hybrid', description: 'Combined approach' }
] as const

const groupId = useId()
</script>

<template>
  <div class="mb-6">
    <fieldset>
      <legend class="text-sm font-medium text-gray-300 mb-3">Search Mode</legend>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          v-for="mode in searchModes" 
          :key="mode.value"
          class="relative"
        >
          <input
            :id="`${groupId}-${mode.value}`"
            v-model="model"
            :value="mode.value"
            type="radio"
            :name="groupId"
            class="sr-only peer"
          >
          <label
            :for="`${groupId}-${mode.value}`"
            class="flex flex-col p-3 text-center border border-gray-600/50 rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-800/30 peer-checked:border-blue-500/50 peer-checked:bg-blue-500/10 peer-checked:text-blue-400 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/50 text-gray-300"
          >
            <span class="text-sm font-medium">{{ mode.label }}</span>
            <span class="text-xs text-gray-400 mt-1 peer-checked:text-blue-300">{{ mode.description }}</span>
          </label>
        </div>
      </div>
    </fieldset>
  </div>
</template> 