export const useSemanticSearch = (searchQuery: Ref<string>) => {
  const isSupported = useSupported(() => 
    import.meta.client && typeof window !== 'undefined'
  )

  const debouncedSearchQuery = refDebounced(searchQuery, 300)
  
  const results = ref<DisplaySearchResult[]>([])
  const isLoading = ref(false)

  const { data: allPosts } = useAsyncData('all-posts-for-semantic-search', () => 
    queryCollection('blog')
      .select('title', 'description', 'path', 'date', 'tags', 'body', 'embedding')
      .all()
  )

  watch(
    [debouncedSearchQuery, allPosts, isSupported],
    async ([query, posts, supported]) => {
      if (!supported || !posts) {
        results.value = []
        return
      }

      if (!query?.trim()) {
        results.value = []
        return
      }

      isLoading.value = true
      
      const result = await tryCatch(
        performSemanticSearch(query, posts)
      )
      
      if (result.error) {
        console.error('Semantic search failed:', result.error)
        results.value = []
        isLoading.value = false
        return
      }
      
      const searchResults = await result.data
      results.value = searchResults.map(({ post, similarity }) => ({
        id: post.path || String(Date.now() * Math.random()),
        title: post.title || '',
        description: post.description || '',
        tags: post.tags || [],
        date: post.date || '',
        slug: post.path?.split('/').pop() || '',
        excerpt: post.description?.slice(0, 150) + '...' || '',
        content: post.description || '',
        similarity
      }))
      isLoading.value = false
    },
    { immediate: true }
  )

  return { 
    results: computed(() => results.value), 
    isLoading: computed(() => isLoading.value),
    isSupported 
  }
} 