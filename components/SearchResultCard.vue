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
  tags,
  searchQuery = '',
  maxTags = 3
} = defineProps<{
  to: string
  title: string
  content: string
  date: string
  tags: string[]
  searchQuery?: string
  maxTags?: number
}>()

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlightText = (text: string, query: string): string => {
  if (!text || !query) return text
  
  const escapedText = escapeHtml(text)
  const escapedQuery = escapeHtml(query.trim())
  
  if (!escapedQuery) return escapedText
  
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  
  return escapedText.replace(regex, '<mark class="bg-yellow-400 text-gray-900 px-1 rounded">$1</mark>')
}

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString.toString()
  }
}

const getContentPreview = (content: string): string => {
  if (!content) return ''
  const cleaned = content.replace(/[#*`]/g, '').trim()
  return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned
}

const highlightedTitle = computed(() => {
  return highlightText(title, searchQuery)
})

const highlightedContent = computed(() => {
  const preview = getContentPreview(content)
  return highlightText(preview, searchQuery)
})

const formattedDate = computed(() => {
  return date ? formatDate(date) : ''
})
</script> 