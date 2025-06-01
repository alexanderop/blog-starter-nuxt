import type { SearchResult } from '~/types/search'

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Getting Started with Nuxt 3',
    description: 'A comprehensive guide to building modern web applications with Nuxt 3, featuring auto-imports, file-based routing, and SSR.',
    content: 'Nuxt 3 is a powerful framework for building Vue.js applications with many built-in features that make development a breeze.',
    tags: ['nuxt', 'vue', 'tutorial'],
    date: '2024-03-22',
    slug: 'getting-started-nuxt',
    excerpt: 'Learn how to build modern web applications with Nuxt 3 and discover its powerful features.'
  },
  {
    id: '2',
    title: 'Understanding the useSearch Composable',
    description: 'Deep dive into creating powerful search functionality with TypeScript, fuzzy matching, and semantic search capabilities.',
    content: 'In this article, we explore how to create a robust search system using Vue composables and advanced search algorithms.',
    tags: ['composables', 'search', 'typescript', 'vue'],
    date: '2024-03-20',
    slug: 'understanding-usesearch-composable',
    excerpt: 'Master the art of building sophisticated search features in Vue applications.'
  },
  {
    id: '3',
    title: 'The Fascinating World of Cats',
    description: 'Explore the mysterious and delightful world of our feline companions, from their hunting instincts to their purring mechanisms.',
    content: 'Cats have been fascinating humans for thousands of years with their mysterious behaviors and independent nature.',
    tags: ['cats', 'animals', 'lifestyle'],
    date: '2024-03-18',
    slug: 'fascinating-world-of-cats',
    excerpt: 'Discover the secrets behind cat behavior and why they make such amazing companions.'
  }
]

export const useDummySearch = (searchQuery: Ref<string>) => {
  const isLoading = ref(false)

  const filteredResults = computed(() => {
    if (!searchQuery.value) return []
    
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      result.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
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