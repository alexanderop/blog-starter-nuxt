<script setup lang="ts">
import { useTemplateRef } from 'vue'

const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')

const searchType = ref<'fuzzy' | 'keyword'>('fuzzy')

const fuzzySearch = await useFuzzySearch()
const keywordSearch = useKeywordSearch()

const searchQuery = computed({
  get: () => searchType.value === 'fuzzy' ? fuzzySearch.searchQuery.value : keywordSearch.searchQuery.value,
  set: (value: string) => {
    if (searchType.value === 'fuzzy') {
      fuzzySearch.searchQuery.value = value
    } else {
      keywordSearch.searchQuery.value = value
    }
  }
})

const results = computed(() => {
  return searchType.value === 'fuzzy' ? fuzzySearch.results.value : keywordSearch.results.value
})

watch(searchType, (newType) => {
  const currentQuery = searchQuery.value
  if (newType === 'fuzzy') {
    fuzzySearch.searchQuery.value = currentQuery
    keywordSearch.searchQuery.value = ''
  } else {
    keywordSearch.searchQuery.value = currentQuery
    fuzzySearch.searchQuery.value = ''
  }
})

onMounted(() => {
  searchInputRef.value?.focus()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Search Blog</h1>
        <p class="text-xl text-gray-300">Find articles, tutorials, and insights</p>
      </div>
      
      <div class="mb-6">
        <div class="flex justify-center space-x-6 mb-6">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="searchType"
              type="radio"
              value="fuzzy"
              class="sr-only"
            >
            <div class="relative">
              <div
:class="[
                'w-4 h-4 rounded-full border-2 transition-all duration-200',
                searchType === 'fuzzy' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-400 bg-transparent'
              ]">
                <div v-if="searchType === 'fuzzy'" class="absolute inset-1 bg-white rounded-full"/>
              </div>
            </div>
            <span class="ml-3 text-white">Fuzzy Search</span>
          </label>
          
          <label class="flex items-center cursor-pointer">
            <input
              v-model="searchType"
              type="radio"
              value="keyword"
              class="sr-only"
            >
            <div class="relative">
              <div
:class="[
                'w-4 h-4 rounded-full border-2 transition-all duration-200',
                searchType === 'keyword' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-400 bg-transparent'
              ]">
                <div v-if="searchType === 'keyword'" class="absolute inset-1 bg-white rounded-full"/>
              </div>
            </div>
            <span class="ml-3 text-white">Keyword Search</span>
          </label>
        </div>
        
        <div class="relative group">
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
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="searchType === 'fuzzy' ? 'Fuzzy search articles...' : 'Keyword search articles...'"
            class="w-full pl-12 pr-12 py-3.5 text-white placeholder-gray-400 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-800/80 hover:border-gray-500/50"
          >

          <button
            v-if="searchQuery"
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white focus:text-white transition-colors duration-200 focus:outline-none"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="results.length" class="space-y-6">
        <article v-for="r in results" :key="r.id" class="border-b border-gray-700 pb-6">
          <h3 class="text-xl font-normal text-white mb-2">{{ r.title }}</h3>
          <p class="text-gray-300" v-html="r.content" />
        </article>
      </div>

      <div v-if="!searchQuery" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          Start typing to search through blog posts
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div class="text-3xl mb-3">💡</div>
            <p class="text-gray-300">
              {{ searchType === 'fuzzy' ? 'Fuzzy search finds similar matches' : 'Search by exact keywords' }}
            </p>
          </div>
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div class="text-3xl mb-3">🔍</div>
            <p class="text-gray-300">
              {{ searchType === 'fuzzy' ? 'Handles typos and partial matches' : 'Use specific keywords for better results' }}
            </p>
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

