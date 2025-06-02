import type { BlogCollectionItem } from '@nuxt/content'

export interface SearchResult extends BlogCollectionItem {
  id: string
  content: string
  slug: string
  excerpt: string
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