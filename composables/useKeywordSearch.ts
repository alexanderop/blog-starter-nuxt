export const useKeywordSearch = (searchQuery: Ref<string>) => {
    const { data: results, pending } = useAsyncData(
      () => `keyword-search-${searchQuery.value}`,
      async () => {
        const query = searchQuery.value.trim()
        if (!query) {
          return []
        }
  
        const posts = await queryCollection('blog')
          .select('title', 'description', 'path', 'date', 'tags')
          .orWhere(builder => 
            builder
              .where('title', 'LIKE', `%${query}%`)
              .where('description', 'LIKE', `%${query}%`)
              .where('tags', 'LIKE', `%${query}%`)
          )
          .limit(20)
          .all()
  
        return posts.map(post => ({
          id: post.path || String(Date.now() * Math.random()),
          title: post.title,
          description: post.description,
          tags: post.tags,
          date: post.date,
          slug: post.path.split('/').pop(),
          excerpt: post.description.slice(0, 150) + '...',
          content: post.description,
        }))
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