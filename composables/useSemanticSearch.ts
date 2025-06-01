import type { SearchResult } from '~/types/search'
import { EMBEDDING_MODEL_NAME } from '~/shared/constants/models'
import { tryCatch } from '~/shared/utils/try-catch'
import { useSupported } from '@vueuse/core'

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

// Functional Core - Pure Functions
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimensions don't match: ${vecA.length} vs ${vecB.length}`);
  }
  
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * (vecB[i] ?? 0), 0);
  const magnitudeA = Math.hypot(...vecA);
  const magnitudeB = Math.hypot(...vecB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
   
  return dotProduct / (magnitudeA * magnitudeB);
}

const createSearchResult = (post: BlogPost, similarity: number): SearchResult => ({
  id: post.path || String(Date.now() * Math.random()),
  title: post.title || 'Untitled',
  description: post.description || '',
  tags: post.tags || [],
  date: post.date || new Date().toISOString(),
  slug: post.path?.split('/').pop() || '',
  excerpt: post.description?.slice(0, 150) + '...' || '',
  content: post.description || '',
  similarity
})

// Imperative Shell - Side Effects
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
  // Client-side support detection using VueUse
  const isSupported = useSupported(() => 
    import.meta.client && typeof window !== 'undefined'
  )

  const debouncedSearchQuery = refDebounced(searchQuery, 300)
  
  // Results and loading state
  const results = ref<SearchResult[]>([])
  const isLoading = ref(false)

  // Fetch all posts for semantic search
  const { data: allPosts } = useAsyncData('all-posts-for-semantic-search', () => 
    queryCollection('blog')
      .select('title', 'description', 'path', 'date', 'tags', 'body', 'embedding')
      .all()
  )

  // Client-side semantic search execution
  const performSemanticSearch = async (query: string) => {
    if (!query.trim() || !allPosts.value || !isSupported.value) {
      return []
    }

    const result = await tryCatch(generateQueryEmbedding(query))
    
    if (result.error) {
      console.error('Semantic search error:', result.error)
      return []
    }
    
    const queryEmbedding = result.data
    
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

  // Watch for search query changes and execute search on client-side only
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
      
      try {
        results.value = await performSemanticSearch(query)
      } catch (error) {
        console.error('Semantic search failed:', error)
        results.value = []
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true }
  )

  return { 
    results: computed(() => results.value), 
    isLoading: computed(() => isLoading.value),
    isSupported 
  }
} 