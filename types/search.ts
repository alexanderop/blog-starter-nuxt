export interface SearchResult {
  id: string
  title: string
  description: string
  content?: string
  tags: string[]
  date: string
  slug: string
  excerpt?: string
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