<template>
  <div class="min-h-screen bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Search Blog</h1>
        <p class="text-xl text-gray-300">Find articles, tutorials, and insights</p>
      </div>

      <div class="mb-8">
        <SearchInput
          ref="searchInputRef"
          v-model="searchQuery"
          placeholder="Search articles..."
          @input="handleSearch"
          @clear="clearSearch"
        />
      </div>

      <div v-if="searchQuery && searchResults.length > 0" class="space-y-6">
        <div class="text-gray-300 mb-4">
          Found {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }} for "{{ searchQuery }}"
        </div>
        
        <div class="space-y-4">
          <SearchResultCard
            v-for="result in searchResults"
            :key="result.id"
            :to="result.id"
            :title="result.title || ''"
            :content="result.content"
            :date="result.date"
            :tags="result.tags"
            :search-query="searchQuery"
            :highlight-function="highlightText"
            :format-date-function="formatDate"
            :get-content-preview-function="getContentPreview"
          />
        </div>
      </div>

      <div v-else-if="searchQuery && searchResults.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          No results found for "{{ searchQuery }}"
        </div>
        <p class="text-gray-500">
          Try different keywords or check your spelling
        </p>
      </div>

      <div v-else-if="!searchQuery" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          Start typing to search through blog posts
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <EmptyStateCard
            icon="💡"
            description="Search by title, content, or tags"
            variant="blue"
          />
          <EmptyStateCard
            icon="🔍"
            description="Use specific keywords for better results"
            variant="green"
          />
          <EmptyStateCard
            icon="⚡"
            description="Real-time search as you type"
            variant="purple"
          />
        </div>
      </div>

      <LoadingSpinner
        v-if="isLoading"
        message="Searching..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchInputRef = ref<{ focus: () => void }>()

const {
  searchQuery,
  searchResults,
  isLoading,
  handleSearch,
  clearSearch,
  getContentPreview,
  highlightText,
  formatDate
} = await useSearch({
  collection: 'blog',
  debounceDelay: 300,
  maxResults: 20
})

onMounted(() => {
  searchInputRef.value?.focus()
})
</script>