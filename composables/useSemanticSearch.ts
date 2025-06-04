import { EMBEDDING_MODEL_NAME } from '~/shared/constants/models'
import type { FeatureExtractionPipeline } from '@xenova/transformers'

let embedder: FeatureExtractionPipeline | null = null

const getOrLoadModel = async (): Promise<FeatureExtractionPipeline> => {
  if (!embedder) {
    const { pipeline } = await import('@xenova/transformers')
    embedder = await pipeline('feature-extraction', EMBEDDING_MODEL_NAME) as FeatureExtractionPipeline
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
  
  const results = ref<DisplaySearchResult[]>([])
  const isLoading = ref(false)

  const { data: allPosts } = useAsyncData('all-posts-for-semantic-search', () => 
    queryCollection('blog')
      .select('title', 'description', 'path', 'date', 'tags', 'body', 'embeddings')
      .all()
  )

  const performSemanticSearch = async (query: string) => {
    if (!query.trim() || !allPosts.value || !isSupported.value) {
      return []
    }

    const queryEmbedding = await generateQueryEmbedding(query)
    
    const postsWithSimilarity = allPosts.value
      .filter(post => post.embeddings && Array.isArray(post.embeddings) && post.embeddings.length > 0)
      .map(post => {
        // Parse embeddings if they're stored as string (from SQL)
        let embeddings = post.embeddings
        if (typeof embeddings === 'string') {
          try {
            embeddings = JSON.parse(embeddings)
          } catch {
            return null
          }
        }
        
        if (!Array.isArray(embeddings)) return null
        
        // Calculate similarity with each chunk and use the highest similarity
        const maxSimilarity = Math.max(
          ...embeddings.map(embedding => 
            embedding.vector ? cosineSimilarity(queryEmbedding, embedding.vector) : 0
          )
        )
        
        return {
          post,
          similarity: maxSimilarity
        }
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.similarity - a!.similarity)
      .slice(0, 20)

    return postsWithSimilarity.map(({ post, similarity }) => ({
      id: post.path || String(Date.now() * Math.random()),
      title: post.title,
      description: post.description,
      tags: post.tags,
      date: post.date,
      slug: post.path?.split('/').pop() || '',
      excerpt: post.description?.slice(0, 150) + '...',
      content: post.description,
      similarity
    })) as DisplaySearchResult[]
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