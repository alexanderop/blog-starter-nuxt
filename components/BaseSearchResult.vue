<script setup lang="ts">
const { 
  results = [], 
  loading = false,
  query = '',
  totalResults = 0 
} = defineProps<{
  results?: DisplaySearchResult[]
  loading?: boolean
  query?: string
  totalResults?: number
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Results Header -->
    <div v-if="query && !loading" class="flex items-center justify-between border-b border-gray-700 pb-4">
      <div class="flex items-center space-x-3">
        <div class="text-sm text-gray-400">
          <span v-if="totalResults > 0">
            {{ totalResults }} result{{ totalResults !== 1 ? 's' : '' }} for 
            <span class="text-blue-400 font-medium">"{{ query }}"</span>
          </span>
          <span v-else>
            No results found for 
            <span class="text-blue-400 font-medium">"{{ query }}"</span>
          </span>
        </div>
      </div>
      
      <div v-if="totalResults > 0" class="text-xs text-gray-500">
        Showing {{ results.length }} of {{ totalResults }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div class="h-6 bg-gray-700 rounded w-3/4 mb-3"/>
          <div class="h-4 bg-gray-700 rounded w-full mb-2"/>
          <div class="h-4 bg-gray-700 rounded w-2/3 mb-4"/>
          <div class="flex space-x-2">
            <div class="h-6 bg-gray-700 rounded w-16"/>
            <div class="h-6 bg-gray-700 rounded w-20"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-else-if="results.length > 0" class="space-y-4">
      <BaseSearchResultItem
        v-for="result in results"
        :key="result.id"
        :result="result"
        :search-query="query"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="query && !loading" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-6 opacity-50">
        <svg class="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
      <p class="text-gray-400 mb-6">
        Try adjusting your search terms or check your spelling
      </p>
      
      <div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 max-w-md mx-auto">
        <h4 class="text-lg font-medium text-white mb-3">Search Tips</h4>
        <ul class="text-sm text-gray-400 space-y-2 text-left">
          <li class="flex items-start space-x-2">
            <span class="text-blue-400 mt-0.5">•</span>
            <span>Try different or more general keywords</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-blue-400 mt-0.5">•</span>
            <span>Check your spelling</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-blue-400 mt-0.5">•</span>
            <span>Use fewer keywords for broader results</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template> 