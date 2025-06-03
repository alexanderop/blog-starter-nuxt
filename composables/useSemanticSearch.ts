import type { BlogCollectionItem } from '@nuxt/content'
import { EMBEDDING_MODEL_NAME } from '~/shared/constants/models'

interface EmbeddingPipeline {
  (text: string, options: { pooling: string; normalize: boolean }): Promise<{ data: Float32Array }>
}

interface BlogPost {
  path?: string
  title?: string
  description?: string
  tags?: string[]
  date?: string
  body?: string
  embedding?: number[]
}

// Module-level state to maintain embedder instance
let embedder: EmbeddingPipeline | null = null

const createSearchResult = (post: Pick<BlogCollectionItem, "title" | "tags" | "description" | "date" | "embedding" | "path" | "body">, similarity: number): SearchResult => ({
  id: post.path || String(Date.now() * Math.random()),
  title: post.title || 'Untitled',
  description: post.description || '',
  tags: post.tags || [],
  date: post.date || new Date().toISOString(),
  slug: post.path?.split('/').pop() || '',
  excerpt: post.description?.slice(0, 150) + '...' || '',
  content: post.description || '',
  path: post.path || '',
  seo: {},
  body: post.body || {},
  stem: post.path?.split('/').pop()?.replace(/\.[^/.]+$/, '') || '',
  readingTime: 0,
  wordCount: 0,
  extension: 'md',
  meta: {},
  similarity
})

const getOrLoadModel = async (): Promise<EmbeddingPipeline> => {
  if (!embedder) {
    const { pipeline } = await import('@xenova/transformers')
    embedder = await pipeline('feature-extraction', EMBEDDING_MODEL_NAME) as EmbeddingPipeline
  }
  return embedder
}

const generateQueryEmbedding = async (query: string): Promise<number[]> => {
  const model = await getOrLoadModel()
  const output = await model(query, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

export const useSemanticSearch = (searchQuery: Ref<string>) => {
  const isSupported = useSupported(() => 
    import.meta.client && typeof window !== 'undefined'
  )

  const debouncedSearchQuery = refDebounced(searchQuery, 300)
  
  const results = ref<SearchResult[]>([])
  const isLoading = ref(false)

  const { data: allPosts } = useAsyncData('all-posts-for-semantic-search', () => 
    queryCollection('blog')
      .select('title', 'description', 'path', 'date', 'tags', 'body', 'embedding')
      .all()
  )

  const performSemanticSearch = async (query: string) => {
    if (!query.trim() || !allPosts.value || !isSupported.value) {
      return []
    }

    const queryEmbedding = await generateQueryEmbedding(query)
    
    const postsWithSimilarity = allPosts.value
      .filter(post => post.embedding && post.embedding.length > 0)
      .map(post => ({
        post,
        similarity: cosineSimilarity(queryEmbedding, post.embedding!)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 20)

    return postsWithSimilarity.map(({ post, similarity }) => 
      createSearchResult(post, similarity)
    )
  }

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
      
      const result = await tryCatch(performSemanticSearch(query))
      
      if (result.error) {
        console.error('Semantic search failed:', result.error)
        results.value = []
        isLoading.value = false
        return
      }
      
      results.value = result.data
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