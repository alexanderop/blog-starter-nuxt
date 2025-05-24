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

  return {
    searchQuery,
    searchResults,
    isLoading,
    allSections,
    handleSearch,
    clearSearch
  }
} 