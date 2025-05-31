export const useKeywordSearch = () => {
    const searchQuery = ref('')
    
    const { data: sections } = useAsyncData('blog-search-sections', () => 
      queryCollectionSearchSections('blog')
    )
  
    const results = computed(() => {
      const query = searchQuery.value.trim()
      if (!query) return []
      
      const normalizedQuery = query.toLowerCase()
      const searchableSections = sections.value ?? []
      
      return searchableSections
        .filter(section => {
          const title = section.title?.toLowerCase() ?? ''
          const content = section.content?.toLowerCase() ?? ''
          return title.includes(normalizedQuery) || content.includes(normalizedQuery)
        })
        .slice(0, 20)
    })
  
    return { searchQuery, results }
  }