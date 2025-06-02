const searchBlogPosts = async (query: string) => {
  if (!query.trim()) return []

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
}

export const useKeywordSearch = (searchQuery: Ref<string>) => {
  const { data: results, pending } = useAsyncData(
    () => `keyword-search-${searchQuery.value}`,
    () => searchBlogPosts(searchQuery.value),
    { watch: [searchQuery] }
  )

  return { 
    results: computed(() => results.value || []), 
    isLoading: computed(() => pending.value) 
  }
}