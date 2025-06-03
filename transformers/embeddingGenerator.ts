import { defineTransformer, type TransformedContent, type MarkdownRoot } from '@nuxt/content'
import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers'

const MODEL = 'Xenova/bge-small-en-v1.5'
let embedder: FeatureExtractionPipeline | null = null

const IGNORED_NODE_KEYS: readonly string[] = ['type', 'id', 'className', 'class', 'style', 'meta', 'language', '__ignoreMap', 'toc']

// Type definitions for AST nodes
interface ASTNode {
  type?: string
  value?: unknown
  children?: unknown
  [key: string]: unknown
}

// Function to extract text from a single AST node
const extractTextFromNode = (node: unknown): string => {
  if (!node) return ''
  if (typeof node === 'string') return node

  if (Array.isArray(node)) {
    // Handle AST node array: [tag, props, ...children]
    if (node.length >= 2 && typeof node[0] === 'string' && typeof node[1] === 'object') {
      return node.slice(2).map(extractTextFromNode).join(' ').trim()
    }
    // Regular array of nodes or children
    return node.map(extractTextFromNode).join(' ').trim()
  }

  if (typeof node === 'object' && node !== null) {
    const astNode = node as ASTNode

    if (astNode.value) return extractTextFromNode(astNode.value)
    if (astNode.children) return extractTextFromNode(astNode.children)
    
    return Object.entries(astNode)
      .filter(([key]) => !IGNORED_NODE_KEYS.includes(key))
      .map(([, value]) => extractTextFromNode(value))
      .join(' ')
      .trim()
  }

  return ''
}

// Function to create semantic chunks from AST structure
interface SemanticChunk {
  text: string
  type: string
  level?: number
  id: string
}

interface ChunkMetadata {
  type: string
  level?: number
}

const getChunkMetadata = (tag: string): ChunkMetadata => {
  if (/^h[1-6]$/.test(tag)) {
    return { type: 'heading', level: parseInt(tag.slice(1), 10) }
  }
  if (tag === 'p') return { type: 'paragraph' }
  if (tag === 'pre' || tag === 'code') return { type: 'code' }
  if (tag === 'blockquote') return { type: 'quote' }
  if (tag === 'ul' || tag === 'ol') return { type: 'list' }
  return { type: 'content' }
}

const createSemanticChunks = (astBody: unknown[], contentId: string): SemanticChunk[] => {
  const chunks: SemanticChunk[] = []
  let chunkCounter = 0
  
  const processNode = (node: unknown, parentType = 'content'): void => {
    if (!node || typeof node !== 'object') return
    
    if (Array.isArray(node)) {
      // Handle AST node arrays: [tag, props, ...children]
      if (node.length >= 2 && typeof node[0] === 'string') {
        const [tag, _props, ...children] = node
        const text = extractTextFromNode(children)
        
        if (text.trim().length > 0) {
          const { type: chunkType, level } = getChunkMetadata(tag)
          
          chunks.push({
            text: text.trim(),
            type: chunkType,
            level,
            id: `${contentId}#chunk-${chunkCounter++}`
          })
          
          // Process children recursively for nested content
          children.forEach(child => processNode(child, chunkType))
        }
      } else {
        // Regular array, process each item
        node.forEach(item => processNode(item, parentType))
      }
    } else {
      // Handle object nodes
      const astNode = node as ASTNode
      if (astNode.children) {
        processNode(astNode.children, parentType)
      } else if (astNode.value) {  
        processNode(astNode.value, parentType)
      }
    }
  }
  
  // Process the AST body
  if (Array.isArray(astBody)) {
    astBody.forEach(node => processNode(node))
  }
  
  // Filter out very small chunks and merge them if needed
  const filteredChunks = chunks.filter(chunk => chunk.text.length >= 20)
  
  // If we have very few chunks, create a fallback full-text chunk
  if (filteredChunks.length === 0) {
    const fullText = extractTextFromNode(astBody)
    if (fullText.trim().length > 0) {
      filteredChunks.push({
        text: fullText.trim(),
        type: 'document',
        id: `${contentId}#full-document`
      })
    }
  }
  
  return filteredChunks
}

const ensureEmbedder = async (): Promise<FeatureExtractionPipeline> => {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', MODEL) as FeatureExtractionPipeline
  }
  return embedder
}

export default defineTransformer({
  name: 'embeddingGenerator',
  extensions: ['.md'],
  async transform(content: TransformedContent) {
    try {
      // Check if we have AST body structure
      if (!content.body || !Array.isArray((content.body as MarkdownRoot)?.value)) {
        return content
      }

      const markdownRoot = content.body as MarkdownRoot

      // Create semantic chunks from AST structure
      const chunks = createSemanticChunks(markdownRoot.value, content.id)
      
      if (!chunks || chunks.length === 0) {
        return content
      }

      // Load model once (lazy loading)
      const model = await ensureEmbedder()

      // Embed each semantic chunk
      const embeddings = await Promise.all(
        chunks.map(async (chunk: SemanticChunk) => {
          
          const result = await model(chunk.text, { pooling: 'mean', normalize: true })
          
          const embedding = {
            id: chunk.id,
            text: chunk.text,
            type: chunk.type,
            level: chunk.level,
            vector: Array.from(result.data)
          }
          
          return embedding
        })
      )


      // Return content with embeddings added, preserving all original properties
      const result = {
        ...content,
        embeddings
      }
      
      return result
    } catch (error) {
      // Return original content unchanged if there's an error
      return {
        ...content,
        embeddingError: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
})
