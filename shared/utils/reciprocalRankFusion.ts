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
  
  export function reciprocalRankFusion<T extends RRFItem>(
    rankedLists: Array<{ items: T[]; weight: number }>,
    options: RRFOptions = {}
  ): T[] {
    const { k = 60, limit = 20 } = options
    
    const bucket: Map<string, RRFResult<T>> = new Map()
    
    rankedLists.forEach(({ items, weight }) => {
      items.forEach((item, idx) => {
        const key = item.slug ?? item.id
        const score = weight * (1 / (idx + k))
        const existing = bucket.get(key)
        
        bucket.set(key, existing 
          ? { item, score: existing.score + score }
          : { item, score }
        )
      })
    })
    
    return [...bucket.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item)
  } 