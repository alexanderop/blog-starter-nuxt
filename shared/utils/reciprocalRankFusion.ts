interface RRFItem {
    slug?: string
    id: string
  }
  
  interface RRFResult<T> {
    item: T
    score: number
  }
  
  interface RRFOptions {
    k?: number
    limit?: number
  }
  
  /**
   * Reciprocal Rank Fusion (RRF) - Combines multiple ranked lists democratically
   * Used for hybrid search where different algorithms rank the same items
   */
  export function reciprocalRankFusion<T extends RRFItem>(
    rankedLists: Array<{ items: T[]; weight: number }>,
    options: RRFOptions = {}
  ): T[] {
    // k=60 is the research-proven default smoothing parameter
    // - Prevents any single ranking from dominating results
    // - Balances influence between high and low ranked items
    const { k = 60, limit = 20 } = options
    
    const bucket: Map<string, RRFResult<T>> = new Map()
    
    // Process each ranked list (e.g., keyword search, semantic search, etc.)
    rankedLists.forEach(({ items, weight }) => {
      items.forEach((item, idx) => {
        // Use slug as unique key, fallback to id
        const key = item.slug ?? item.id
        // RRF formula: score = weight × (1 / (rank + k))
        // Higher rank (lower index) = higher score, but smoothed by k
        const score = weight * (1 / (idx + k))
        const existing = bucket.get(key)
        
        // Accumulate scores from multiple rankings for same item
        bucket.set(key, existing 
          ? { item, score: existing.score + score }
          : { item, score }
        )
      })
    })
    
    // Sort by combined RRF score (highest first) and return top results
    return [...bucket.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item)
  } 