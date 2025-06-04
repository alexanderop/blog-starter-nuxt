import Fuse from 'fuse.js'
import type { SearchResult } from '~/types/search'

export const useFuzzySearch = (searchQuery: Ref<string>) => {
  const { data: allPosts, pending } = useAsyncData('all-posts-for-fuzzy-search', () =>
    queryCollection('blog')
      .select('title', 'description', 'path', 'date', 'tags', 'body', 'readingTime', 'wordCount', 'lastModified')
      .all()
  )

  const options: Fuse.IFuseOptions<SearchResult> = {
    keys: ['title', 'description', 'tags'],
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    ignoreLocation: true,
  }

  const fuse = computed(() => new Fuse(allPosts.value || [], { ...options }))

  const results = computed(() => {
    const query = searchQuery.value.trim()
    if (!query) {
      return []
    }

    const fuseResults = fuse.value.search(query)
    
    return fuseResults
      .slice(0, 20)
      .map(result => ({
        id: result.item.path || String(Date.now() * Math.random()),
        title: result.item.title || 'Untitled',
        description: result.item.description || '',
        tags: result.item.tags || [],
        date: result.item.date || new Date().toISOString(),
        slug: result.item.path?.split('/').pop() || '',
        excerpt: result.item.description?.slice(0, 150) + '...' || '',
        content: result.item.description || '',
      })) as SearchResult[]
  })
  
  return {
    results,
    isLoading: computed(() => pending.value)
  }
}
