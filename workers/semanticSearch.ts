import type { FeatureExtractionPipeline } from '@xenova/transformers'
import type { MarkdownRoot } from '@nuxt/content'

let embedder: FeatureExtractionPipeline | null = null

const EMBEDDING_MODEL_NAME = 'Xenova/bge-small-en-v1.5'

const getOrLoadModel = async (): Promise<FeatureExtractionPipeline> => {
  if (!embedder) {
    const { pipeline } = await import('@xenova/transformers')
    embedder = await pipeline('feature-extraction', EMBEDDING_MODEL_NAME) as FeatureExtractionPipeline
  }
  return embedder
}

export const generateQueryEmbedding = async (query: string): Promise<number[]> => {
  const model = await getOrLoadModel()
  const output = await model(query, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

type PostData = {
  title?: string
  description?: string
  path?: string
  date?: string
  tags?: string[]
  body?: MarkdownRoot
  embedding?: number[]
}

export const performSemanticSearch = async (
  query: string,
  posts: PostData[]
): Promise<Array<{ post: PostData; similarity: number }>> => {
  if (!query.trim() || !posts) {
    return []
  }

  const queryEmbedding = await generateQueryEmbedding(query)
  
  const postsWithSimilarity = posts
    .filter(post => post.embedding && post.embedding.length > 0)
    .map(post => ({
      post,
      similarity: cosineSimilarity(queryEmbedding, post.embedding!)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 20)

  return postsWithSimilarity
} 