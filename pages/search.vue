<script setup lang="ts">
const searchQuery = ref('')
const searchMode = ref<SearchMode>('keyword')
const showHybridBreakdown = ref(false)

const { 
  results: keywordResults, 
  isLoading: keywordIsLoading 
} = useKeywordSearch(searchQuery)

const { 
  results: fuzzyResults, 
  isLoading: fuzzyIsLoading 
} = useFuzzySearch(searchQuery)

const { 
  results: semanticResults, 
  isLoading: semanticIsLoading,
  isSupported: semanticIsSupported 
} = useSemanticSearch(searchQuery)

const { 
  results: hybridResults, 
  isLoading: hybridIsLoading,
  isSupported: hybridIsSupported,
  searchInfo: hybridSearchInfo
} = useHybridSearch(searchQuery)

const currentResults = computed(() => {
  if (searchMode.value === 'keyword') {
    return keywordResults.value
  }
  if (searchMode.value === 'fuzzy') {
    return fuzzyResults.value
  }
  if (searchMode.value === 'semantic') {
    return semanticResults.value
  }
  if (searchMode.value === 'hybrid') {
    return hybridResults.value
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
  if (searchMode.value === 'semantic') {
    return semanticIsLoading.value
  }
  if (searchMode.value === 'hybrid') {
    return hybridIsLoading.value
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
      
      <!-- Search Mode Description -->
      <div v-if="searchMode === 'semantic'" class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 mt-0.5">
            <svg v-if="semanticIsSupported" class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 v-if="semanticIsSupported" class="text-sm font-medium text-blue-300 mb-1">Semantic Search</h3>
            <h3 v-else class="text-sm font-medium text-amber-300 mb-1">Semantic Search (Limited)</h3>
            <p v-if="semanticIsSupported" class="text-xs text-blue-200/80">
              This search understands meaning and context, not just keywords. Results are ranked by semantic similarity scores (0-1, where 1 is most similar).
            </p>
            <p v-else class="text-xs text-amber-200/80">
              Semantic search is only available on the client-side. If you're seeing this on the server, it will work once the page loads in your browser.
            </p>
          </div>
        </div>
      </div>

      <!-- Hybrid Search Description -->
      <div v-if="searchMode === 'hybrid'" class="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 mt-0.5">
            <svg v-if="hybridIsSupported" class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <svg v-else class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 v-if="hybridIsSupported" class="text-sm font-medium text-purple-300 mb-1">Hybrid Search</h3>
            <h3 v-else class="text-sm font-medium text-amber-300 mb-1">Hybrid Search (Fuzzy Only)</h3>
            <p v-if="hybridIsSupported" class="text-xs text-purple-200/80">
              Combines fuzzy text matching with semantic understanding for the most accurate results. Results that match both approaches are prioritized with a weighted score (50% fuzzy, 50% semantic).
            </p>
            <p v-else class="text-xs text-amber-200/80">
              Currently running in fuzzy-only mode. Semantic features will activate once the page loads in your browser for enhanced accuracy.
            </p>
            <p v-if="hybridIsSupported && hybridSearchInfo.isHybrid" class="text-xs text-purple-200/60 mt-1">
              Found {{ hybridSearchInfo.totalFuzzyResults }} fuzzy matches and {{ hybridSearchInfo.totalSemanticResults }} semantic matches.
            </p>
            
            <!-- Badge Legend -->
            <div v-if="hybridIsSupported" class="mt-3 pt-3 border-t border-purple-500/20">
              <p class="text-xs text-purple-200/60 mb-2">Result badges show how each match was found:</p>
              <div class="flex flex-wrap gap-2 text-[10px]">
                <div class="flex items-center space-x-1">
                  <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Text Match</span>
                  <span class="text-purple-200/50">= Fuzzy search only</span>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Meaning Match</span>
                  <span class="text-purple-200/50">= Semantic only</span>
                </div>
              </div>
            </div>

            <!-- Show Breakdown Button -->
            <div v-if="hybridIsSupported && searchQuery && hybridSearchInfo.isHybrid" class="mt-3 pt-3 border-t border-purple-500/20">
              <button
                class="flex items-center space-x-2 text-xs text-purple-300 hover:text-purple-200 transition-colors"
                @click="showHybridBreakdown = !showHybridBreakdown"
              >
                <svg 
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': showHybridBreakdown }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span>{{ showHybridBreakdown ? 'Hide' : 'Show' }} search breakdown</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <BaseInputSearch
          v-model="searchQuery"
          placeholder="Search articles..."
          autofocus
        />
      </div>

      <!-- Hybrid Search Breakdown Accordion -->
      <div v-if="searchMode === 'hybrid' && searchQuery && showHybridBreakdown && hybridIsSupported" class="mb-8">
        <div class="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          <div class="p-4 bg-gray-800/80 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">Search Breakdown</h3>
            <p class="text-sm text-gray-400">Understanding how hybrid search combines results</p>
          </div>
          
          <div class="divide-y divide-gray-700">
            <!-- Fuzzy Results Section -->
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-md font-medium text-blue-400">Fuzzy Search Results</h4>
                <span class="text-sm text-gray-400">{{ fuzzyResults.length }} matches</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">
                Text-based matching using fuzzy logic. Results ranked by text similarity.
              </p>
              <div v-if="fuzzyResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
                <div 
                  v-for="(result, index) in fuzzyResults.slice(0, 10)" 
                  :key="`fuzzy-${result.id}`"
                  class="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-white">{{ result.title }}</h5>
                      <p class="text-xs text-gray-400 mt-1">{{ result.description }}</p>
                    </div>
                    <div class="ml-3 text-right">
                      <div class="text-xs text-blue-400">Rank #{{ index + 1 }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">No fuzzy matches found</div>
            </div>

            <!-- Semantic Results Section -->
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-md font-medium text-green-400">Semantic Search Results</h4>
                <span class="text-sm text-gray-400">{{ semanticResults.length }} matches</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">
                Meaning-based matching using AI embeddings. Results ranked by semantic similarity (0-1 score).
              </p>
              <div v-if="semanticResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
                <div 
                  v-for="(result, index) in semanticResults.slice(0, 10)" 
                  :key="`semantic-${result.id}`"
                  class="p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-white">{{ result.title }}</h5>
                      <p class="text-xs text-gray-400 mt-1">{{ result.description }}</p>
                    </div>
                    <div class="ml-3 text-right">
                      <div class="text-xs text-green-400">
                        Score: {{ result.similarity?.toFixed(3) || 'N/A' }}
                      </div>
                      <div class="text-xs text-green-400">Rank #{{ index + 1 }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">No semantic matches found</div>
            </div>

            <!-- Final Hybrid Results Section -->
            <div class="p-4 bg-purple-500/5">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-md font-medium text-purple-400">Final Hybrid Results</h4>
                <span class="text-sm text-gray-400">{{ hybridResults.length }} matches</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">
                Combined results using Reciprocal Rank Fusion (RRF) with equal weighting (50% fuzzy + 50% semantic).
                Higher-ranked results from both searches get boosted scores.
              </p>
              <div v-if="hybridResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
                <div 
                  v-for="(result, index) in hybridResults.slice(0, 10)" 
                  :key="`hybrid-${result.id}`"
                  class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-white">{{ result.title }}</h5>
                      <p class="text-xs text-gray-400 mt-1">{{ result.description }}</p>
                      <div class="flex items-center space-x-2 mt-2">
                        <span 
                          v-if="fuzzyResults.some(r => r.id === result.id)"
                          class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]"
                        >
                          Text Match
                        </span>
                        <span 
                          v-if="semanticResults.some(r => r.id === result.id)"
                          class="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]"
                        >
                          Meaning Match
                        </span>
                      </div>
                    </div>
                    <div class="ml-3 text-right">
                      <div class="text-xs text-purple-400">Final Rank #{{ index + 1 }}</div>
                      <div class="text-xs text-gray-500">
                        RRF Score: {{ ((1 / (index + 60)) * 100).toFixed(2) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">No hybrid results found</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="searchQuery">
        <BaseSearchResult
          :results="currentResults"
          :loading="isLoading"
          :query="searchQuery"
          :total-results="currentResults.length"
          :search-mode="searchMode" />
      </div>

      <div v-else class="text-center py-12"/>
    </div>
  </div>
</template>