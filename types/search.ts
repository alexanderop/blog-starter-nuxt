import type { BlogPost } from '~/schema/blog'

export interface SearchResult extends BlogPost {
  id: string
  content: string
  slug: string
  excerpt: string
  similarity?: number
}

export type SearchMode = 'keyword' | 'fuzzy' | 'semantic' | 'hybrid'

export interface SearchOptions {
  query: string
  mode: SearchMode
  limit?: number
  offset?: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  hasMore: boolean
} 