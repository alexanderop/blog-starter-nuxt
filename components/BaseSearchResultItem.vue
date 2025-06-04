<script setup lang="ts">
const { 
  result,
  searchQuery = '',
  searchMode = 'keyword'
} = defineProps<{
  result: DisplaySearchResult
  searchQuery?: string
  searchMode?: SearchMode
}>()

const highlightText = (text: string, query: string): string => {
  if (!query || !text) return text
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  let highlightedText = text
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-200 px-0.5 rounded">$1</mark>')
  })
  
  return highlightedText
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatSimilarity = (similarity: number): string => {
  return (similarity * 100).toFixed(1)
}

const getSimilarityColor = (similarity: number): string => {
  if (similarity >= 0.8) return 'text-green-400'
  if (similarity >= 0.6) return 'text-yellow-400'
  if (similarity >= 0.4) return 'text-orange-400'
  return 'text-red-400'
}

const truncateContent = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength).trim() + '...'
}

const getExcerpt = (): string => {
  return result.excerpt || truncateContent(result.description || result.content || '', 150)
}

const navigateToPost = () => {
  navigateTo(`/blog/${result.slug}`)
}

const getSourceIcon = (source: string) => {
  if (source === 'both') return 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
  if (source === 'fuzzy') return 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
  return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
}

const getSourceLabel = (source: string) => {
  if (source === 'both') return 'Combined'
  if (source === 'fuzzy') return 'Text Match'
  return 'Meaning Match'
}

const getSourceColor = (source: string) => {
  if (source === 'both') return 'text-purple-400 bg-purple-500/20 border-purple-400/30'
  if (source === 'fuzzy') return 'text-blue-400 bg-blue-500/20 border-blue-400/30'
  return 'text-green-400 bg-green-500/20 border-green-400/30'
}

const calculateWeightedScore = () => {
  if (result.source === 'both' && result.fuzzyScore && result.semanticScore) {
    const fuzzyWeight = 0.4
    const semanticWeight = 0.6
    return (result.fuzzyScore * fuzzyWeight + result.semanticScore * semanticWeight) * 100
  }
  return result.similarity ? result.similarity * 100 : 0
}
</script>

<template>
  <article 
    class="group relative bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
    @click="navigateToPost"
  >
    <!-- Similarity Badge for Semantic Search -->
    <div v-if="searchMode === 'semantic' && result.similarity !== undefined" class="absolute top-4 right-4">
      <div class="flex items-center space-x-1 px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-600/50">
        <svg class="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span :class="['text-xs font-medium', getSimilarityColor(result.similarity)]">
          {{ formatSimilarity(result.similarity) }}%
        </span>
      </div>
    </div>

    <!-- Hybrid Search Indicator with Tooltip -->
    <div 
      v-if="searchMode === 'hybrid' && result.source" 
      class="absolute top-4 right-4 group/tooltip"
    >
      <div :class="['w-3 h-3 rounded-full border-2 cursor-help transition-all duration-200 hover:scale-110', getSourceColor(result.source)]">
        <svg class="w-full h-full p-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path :d="getSourceIcon(result.source)" />
        </svg>
      </div>
      
      <!-- Tooltip -->
      <div class="absolute right-0 top-6 mt-1 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 z-50">
        <div class="bg-gray-900/95 backdrop-blur-sm border border-gray-600/80 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
          <div class="text-xs font-medium text-gray-200">
            <div class="text-white font-semibold mb-1">{{ getSourceLabel(result.source) }}</div>
            <div v-if="result.source === 'both' && result.fuzzyScore && result.semanticScore" class="space-y-0.5">
              <div class="flex justify-between space-x-3">
                <span class="text-blue-300">Fuzzy:</span>
                <span class="text-blue-100">{{ (result.fuzzyScore * 100).toFixed(0) }}%</span>
              </div>
              <div class="flex justify-between space-x-3">
                <span class="text-green-300">Semantic:</span>
                <span class="text-green-100">{{ (result.semanticScore * 100).toFixed(0) }}%</span>
              </div>
              <div class="border-t border-gray-600/50 pt-0.5 mt-1">
                <div class="flex justify-between space-x-3">
                  <span class="text-purple-300 font-medium">Final:</span>
                  <span class="text-purple-100 font-medium">{{ calculateWeightedScore().toFixed(0) }}%</span>
                </div>
              </div>
            </div>
            <div v-else-if="result.similarity" class="flex justify-between space-x-3">
              <span class="text-gray-300">Score:</span>
              <span class="text-white">{{ (result.similarity * 100).toFixed(0) }}%</span>
            </div>
          </div>
          
          <!-- Tooltip Arrow -->
          <div class="absolute -top-1 right-3 w-2 h-2 bg-gray-900/95 border-l border-t border-gray-600/80 transform rotate-45"/>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <!-- Title -->
      <h3 class="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 line-clamp-2">
        <span v-html="highlightText(result.title, searchQuery)"/>
      </h3>
      
      <!-- Description/Excerpt -->
      <p class="text-gray-300 leading-relaxed line-clamp-3">
        <span v-html="highlightText(getExcerpt(), searchQuery)"/>
      </p>
      
      <!-- Tags and Date -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-700/50">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in result.tags.slice(0, 3)"
            :key="tag"
            class="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 transition-colors hover:bg-blue-500/20"
          >
            <span v-html="highlightText(tag, searchQuery)"/>
          </span>
          
          <span
            v-if="result.tags.length > 3"
            class="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-600/30 text-gray-400 rounded-full border border-gray-600/30"
          >
            +{{ result.tags.length - 3 }}
          </span>
        </div>
        
        <div class="flex items-center space-x-3 text-xs text-gray-400">
          <!-- Semantic similarity info -->
          <div v-if="searchMode === 'semantic' && result.similarity !== undefined" class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span :class="getSimilarityColor(result.similarity)">
              {{ formatSimilarity(result.similarity) }}% match
            </span>
          </div>
          
          <time :datetime="result.date" class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(result.date) }}</span>
          </time>
        </div>
      </div>
    </div>
    
    <!-- Hover Arrow -->
    <div
class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" :class="{ 
      'right-10': (searchMode === 'semantic' || searchMode === 'hybrid') && (result.similarity !== undefined || result.source)
    }">
      <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
    
    <!-- Focus Ring -->
    <div class="absolute inset-0 rounded-lg ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-900 opacity-0 transition-opacity duration-200 pointer-events-none group-focus-within:opacity-100"/>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(mark) {
  background-color: rgb(251 191 36 / 0.3);
  color: rgb(254 240 138);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
</style> 