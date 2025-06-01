<script setup lang="ts">
import type { SearchMode } from '~/types/search'
import { useDummySearch } from '~/composables/useDummySearch'

const searchQuery = ref('')
const searchMode = ref<SearchMode>('keyword')

const { isLoading, filteredResults } = useDummySearch(searchQuery)
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

      <!-- Search Results -->
      <div v-if="searchQuery">
        <BaseSearchResult
          :results="filteredResults"
          :loading="isLoading"
          :query="searchQuery"
          :total-results="filteredResults.length"
        />
      </div>

      <!-- Welcome State (when no search query) -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          Start typing to search through blog posts
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div class="text-3xl mb-3">💡</div>
            <p class="text-gray-300">Search by title, content, or tags</p>
          </div>
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div class="text-3xl mb-3">🔍</div>
            <p class="text-gray-300">Use specific keywords for better results</p>
          </div>
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div class="text-3xl mb-3">⚡</div>
            <p class="text-gray-300">Real-time search as you type</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

