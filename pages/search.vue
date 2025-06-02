<script setup lang="ts">
const searchQuery = ref('')
const searchMode = ref<SearchMode>('keyword')

const { 
  results: keywordResults, 
  isLoading: keywordIsLoading 
} = useKeywordSearch(searchQuery)

const { 
  results: fuzzyResults, 
  isLoading: fuzzyIsLoading 
} = useFuzzySearch(searchQuery)

const currentResults = computed(() => {
  if (searchMode.value === 'keyword') {
    return keywordResults.value
  }
  if (searchMode.value === 'fuzzy') {
    return fuzzyResults.value
  }
  return []
})

const isLoading = computed(() => {
  if (searchMode.value === 'keyword') {
    return keywordIsLoading.value
  }
  if (searchMode.value === 'fuzzy') {
    return fuzzyIsLoading.value
  }
  return false
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Search Blog</h1>
        <p class="text-xl text-gray-300">Find articles, tutorials, and insights</p>
      </div>
      
      <BaseSearchSelection v-model="searchMode" />
      
      <div class="mb-8">
        <BaseInputSearch
          v-model="searchQuery"
          placeholder="Search articles..."
          autofocus
        />
      </div>

      <div v-if="searchQuery">
        <BaseSearchResult
          :results="currentResults"
          :loading="isLoading"
          :query="searchQuery"
          :total-results="currentResults.length" />
      </div>

      <div v-else class="text-center py-12"/>
    </div>
  </div>
</template>