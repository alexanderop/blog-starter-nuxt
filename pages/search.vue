<template>
  <div class="min-h-screen bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Search Blog</h1>
        <p class="text-xl text-gray-300">Find articles, tutorials, and insights</p>
      </div>

      <!-- Search Input -->
      <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search articles..."
          class="w-full pl-10 pr-12 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
          @keydown.esc="clearSearch"
        >
        <!-- Clear Button -->
        <button
          v-if="searchQuery"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          type="button"
          aria-label="Clear search"
          @click="clearSearch"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery && searchResults.length > 0" class="space-y-6">
        <div class="text-gray-300 mb-4">
          Found {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }} for "{{ searchQuery }}"
        </div>
        
        <div class="space-y-4">
          <article
            v-for="result in searchResults"
            :key="result.id"
            class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <NuxtLink
              :to="result.id"
              class="block group"
            >
              <h2 class="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors" v-html="highlightText(result.title || '', searchQuery)"/>
              <p class="text-gray-300 mb-3 leading-relaxed" v-html="highlightText(getContentPreview(result.content), searchQuery)"/>
              <div class="flex items-center text-sm text-gray-400">
                <span>{{ formatDate(result.date) }}</span>
                <span v-if="result.tags && result.tags.length > 0" class="ml-4">
                  <span v-for="tag in result.tags.slice(0, 3)" :key="tag" class="inline-block bg-gray-700 px-2 py-1 rounded text-xs mr-2">
                    {{ tag }}
                  </span>
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && searchResults.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          No results found for "{{ searchQuery }}"
        </div>
        <p class="text-gray-500">
          Try different keywords or check your spelling
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!searchQuery" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          Start typing to search through blog posts
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div class="text-blue-400 mb-2">💡 Tips</div>
            <div class="text-sm text-gray-300">Search by title, content, or tags</div>
          </div>
          <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div class="text-green-400 mb-2">🔍 Advanced</div>
            <div class="text-sm text-gray-300">Use specific keywords for better results</div>
          </div>
          <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div class="text-purple-400 mb-2">⚡ Fast</div>
            <div class="text-sm text-gray-300">Real-time search as you type</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
        <p class="text-gray-400 mt-2">Searching...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Search - Blog',
  meta: [
    { name: 'description', content: 'Search through blog posts and articles' }
  ]
})

// Reactive data
const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)
const allSections = ref([])

// Fetch search data on mount
const { data: searchData } = await useAsyncData('search-sections', () => 
  queryCollectionSearchSections('blog')
)

allSections.value = searchData.value || []

// Search functionality
const handleSearch = useDebouncedRef(() => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  
  try {
    const query = searchQuery.value.toLowerCase().trim()
    
    // Simple but effective search algorithm
    const results = allSections.value
      .map(section => {
        let score = 0
        const titleMatch = section.title?.toLowerCase().includes(query)
        const contentMatch = section.content?.toLowerCase().includes(query)
        const descriptionMatch = section.description?.toLowerCase().includes(query)
        const tagMatch = section.tags?.some(tag => tag.toLowerCase().includes(query))
        
        // Scoring system
        if (titleMatch) score += 10
        if (descriptionMatch) score += 5
        if (contentMatch) score += 3
        if (tagMatch) score += 7
        
        return { ...section, score }
      })
      .filter(section => section.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Limit to 20 results
    
    searchResults.value = results
  } finally {
    isLoading.value = false
  }
}, 300)

// Clear search function
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  isLoading.value = false
}

// Helper functions
const getContentPreview = (content) => {
  if (!content) return ''
  // Remove markdown and limit to 150 characters
  const cleaned = content.replace(/[#*`]/g, '').trim()
  return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned
}

const highlightText = (text, query) => {
  if (!text || !query) return text
  
  // Escape HTML to prevent XSS
  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  
  const escapedText = escapeHtml(text)
  const escapedQuery = escapeHtml(query.trim())
  
  if (!escapedQuery) return escapedText
  
  // Create a regex to find all instances of the search term (case-insensitive)
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  
  // Replace with highlighted version
  return escapedText.replace(regex, '<mark class="bg-yellow-400 text-gray-900 px-1 rounded">$1</mark>')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Debounced ref utility
function useDebouncedRef(fn, delay = 300) {
  let timeoutId
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, delay)
  }
}
</script>