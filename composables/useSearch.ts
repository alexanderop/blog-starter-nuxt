import { ref, type Ref } from 'vue'

interface SearchSection {
  id: string
  title?: string
  content?: string
  description?: string
  tags?: string[]
  date?: string
  score?: number
}

interface UseSearchOptions {
  collection?: 'blog'
  debounceDelay?: number
  maxResults?: number
}

interface UseSearchReturn {
  searchQuery: Ref<string>
  searchResults: Ref<SearchSection[]>
  isLoading: Ref<boolean>
  allSections: Ref<SearchSection[]>
  handleSearch: () => void
  clearSearch: () => void
  getContentPreview: (content: string) => string
  highlightText: (text: string, query: string) => string
  formatDate: (dateString: string) => string
}

const calculateSearchScore = (section: SearchSection, query: string): number => {
  let score = 0
  const normalizedQuery = query.toLowerCase()
  
  const titleMatch = section.title?.toLowerCase().includes(normalizedQuery)
  const contentMatch = section.content?.toLowerCase().includes(normalizedQuery)
  const descriptionMatch = section.description?.toLowerCase().includes(normalizedQuery)
  const tagMatch = section.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
  
  if (titleMatch) score += 10
  if (descriptionMatch) score += 5
  if (contentMatch) score += 3
  if (tagMatch) score += 7
  
  return score
}

const performSearchOperation = (
  sections: SearchSection[], 
  query: string, 
  maxResults: number
): SearchSection[] => {
  if (!query.trim()) return []
  
  const normalizedQuery = query.toLowerCase().trim()
  
  return sections
    .map(section => ({
      ...section,
      score: calculateSearchScore(section, normalizedQuery)
    }))
    .filter(section => section.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
}

const createContentPreview = (content: string): string => {
  if (!content) return ''
  const cleaned = content.replace(/[#*`]/g, '').trim()
  return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const createHighlightedText = (text: string, query: string): string => {
  if (!text || !query) return text
  
  const escapedText = escapeHtml(text)
  const escapedQuery = escapeHtml(query.trim())
  
  if (!escapedQuery) return escapedText
  
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  
  return escapedText.replace(regex, '<mark class="bg-yellow-400 text-gray-900 px-1 rounded">$1</mark>')
}

const formatDateString = (dateString: string): string => {
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

const createDebouncedFunction = (fn: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, delay)
  }
}

export const useSearch = async (options: UseSearchOptions = {}): Promise<UseSearchReturn> => {
  const {
    collection = 'blog',
    debounceDelay = 300,
    maxResults = 20
  } = options

  const searchQuery = ref('')
  const searchResults = ref<SearchSection[]>([])
  const isLoading = ref(false)
  const allSections = ref<SearchSection[]>([])

  const { data: searchData } = await useAsyncData(`search-sections-${collection}`, () => 
    queryCollectionSearchSections(collection)
  )

  allSections.value = searchData.value || []

  const performSearch = () => {
    isLoading.value = true
    
    try {
      const results = performSearchOperation(
        allSections.value, 
        searchQuery.value, 
        maxResults
      )
      searchResults.value = results
    } finally {
      isLoading.value = false
    }
  }

  const handleSearch = createDebouncedFunction(performSearch, debounceDelay)

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isLoading.value = false
  }

  const getContentPreview = createContentPreview
  const highlightText = createHighlightedText
  const formatDate = formatDateString

  return {
    searchQuery,
    searchResults,
    isLoading,
    allSections,
    handleSearch,
    clearSearch,
    getContentPreview,
    highlightText,
    formatDate
  }
} 