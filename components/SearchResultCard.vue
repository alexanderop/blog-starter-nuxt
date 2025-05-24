<template>
  <article class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
    <NuxtLink
      :to="to"
      class="block group"
    >
      <h2 
        class="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors" 
        v-html="highlightedTitle"
      />
      <p 
        class="text-gray-300 mb-3 leading-relaxed" 
        v-html="highlightedContent"
      />
      <div class="flex items-center text-sm text-gray-400">
        <span v-if="date">{{ formattedDate }}</span>
        <span v-if="tags && tags.length > 0" :class="{ 'ml-4': date }">
          <span 
            v-for="tag in tags.slice(0, maxTags)" 
            :key="tag" 
            class="inline-block bg-gray-700 px-2 py-1 rounded text-xs mr-2"
          >
            {{ tag }}
          </span>
        </span>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
const { 
  to,
  title,
  content,
  date,
  tags = [],
  searchQuery = '',
  maxTags = 3,
  highlightFunction = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-300 text-gray-900">$1</mark>')
  },
  formatDateFunction = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },
  getContentPreviewFunction = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText
  }
} = defineProps<{
  to: string
  title: string
  content: string
  date?: string | Date
  tags?: string[]
  searchQuery?: string
  maxTags?: number
  highlightFunction?: (text: string, query: string) => string
  formatDateFunction?: (date: string | Date) => string
  getContentPreviewFunction?: (content: string) => string
}>()

const highlightedTitle = computed(() => {
  return highlightFunction(title, searchQuery)
})

const highlightedContent = computed(() => {
  const preview = getContentPreviewFunction(content)
  return highlightFunction(preview, searchQuery)
})

const formattedDate = computed(() => {
  return date ? formatDateFunction(date) : ''
})
</script> 