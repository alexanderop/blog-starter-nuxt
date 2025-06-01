<script setup lang="ts">
import type { SearchResult } from '~/types/search'

const { 
  result,
  searchQuery = '' 
} = defineProps<{
  result: SearchResult
  searchQuery?: string
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
</script>

<template>
  <article 
    class="group relative bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
    @click="navigateToPost"
  >
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
    <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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