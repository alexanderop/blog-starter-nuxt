import type { SearchResult } from '~/types/search'

export const useKeywordSearch = (searchQuery: Ref<string>) => {
    const { data: results, pending } = useAsyncData(
      () => `keyword-search-${searchQuery.value}`,
      async () => {
        const query = searchQuery.value.trim()
        if (!query) {
          return []
        }
  
        const posts = await queryCollection('blog')
          .select('title', 'description', 'path', 'date', 'tags', 'rawbody')
          .orWhere(builder => 
            builder
              .where('title', 'LIKE', `%${query}%`)
              .where('description', 'LIKE', `%${query}%`)
              .where('rawbody', 'LIKE', `%${query}%`)
              .where('tags', 'LIKE', `%${query}%`)
          )
          .limit(20)
          .all()
  
        return posts.map(post => ({
          id: post.path || String(Date.now() * Math.random()),
          title: post.title || 'Untitled',
          description: post.description || '',
          tags: post.tags || [],
          date: post.date || new Date().toISOString(),
          slug: post.path?.split('/').pop() || '',
          excerpt: post.rawbody?.slice(0, 150) + '...' || '',
          content: post.rawbody || post.description || '',
        })) as SearchResult[]
      },
      {
        watch: [searchQuery]
      }
    )
  
    return { 
      results: computed(() => results.value || []), 
      isLoading: computed(() => pending.value) 
    }
  }