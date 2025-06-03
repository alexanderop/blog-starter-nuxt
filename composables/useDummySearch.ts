import type { DisplaySearchResult } from '~/types/search'

const mockResults: DisplaySearchResult[] = [
  {
    id: '1',
    title: 'Getting Started with Nuxt 3',
    description: 'A comprehensive guide to building modern web applications with Nuxt 3, featuring auto-imports, file-based routing, and SSR.',
    tags: ['nuxt', 'vue', 'tutorial'],
    date: '2024-03-22',
    slug: 'getting-started-nuxt',
    excerpt: 'Learn how to build modern web applications with Nuxt 3 and discover the power of auto-imports and file-based routing.',
    content: 'Nuxt 3 is a powerful framework for building Vue.js applications. In this comprehensive guide, we\'ll explore the key features that make Nuxt 3 an excellent choice for modern web development. From auto-imports that eliminate boilerplate code to file-based routing that simplifies navigation, Nuxt 3 provides a developer-friendly experience while maintaining excellent performance through server-side rendering.'
  },
  {
    id: '2',
    title: 'Understanding the useSearch Composable',
    description: 'Deep dive into creating powerful search functionality with TypeScript, fuzzy matching, and semantic search capabilities.',
    tags: ['composables', 'search', 'typescript', 'vue'],
    date: '2024-03-20',
    slug: 'understanding-usesearch-composable',
    excerpt: 'Explore advanced search patterns and learn how to implement fuzzy matching and semantic search in your Vue applications.',
    content: 'Creating effective search functionality is crucial for user experience. This article explores various search patterns including keyword matching, fuzzy search algorithms, and semantic search capabilities. We\'ll build a flexible useSearch composable that can handle different search modes and provide powerful filtering capabilities for your Vue.js applications.'
  },
  {
    id: '3',
    title: 'The Fascinating World of Cats',
    description: 'Explore the mysterious and delightful world of our feline companions, from their hunting instincts to their purring mechanisms.',
    tags: ['cats', 'animals', 'lifestyle'],
    date: '2024-03-18',
    slug: 'fascinating-world-of-cats',
    excerpt: 'Discover the amazing behaviors and characteristics that make cats such unique and beloved companions.',
    content: 'Cats have been fascinating humans for thousands of years. From their incredible hunting abilities to their soothing purr that can actually promote healing, these remarkable creatures continue to surprise us. This exploration covers their evolutionary adaptations, behavioral patterns, and the special bond they form with their human companions.'
  }
]

export const useDummySearch = (searchQuery: Ref<string>) => {
  const isLoading = ref(false)

  const filteredResults = computed(() => {
    if (!searchQuery.value) return []
    
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      result.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      result.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      result.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  watch(searchQuery, (newQuery) => {
    if (newQuery) {
      isLoading.value = true
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  })

  return {
    isLoading,
    filteredResults
  }
}