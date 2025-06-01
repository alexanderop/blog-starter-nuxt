import type { SearchResult } from '~/types/search'
import { useFuzzySearch } from './useFuzzySearch'
import { useSemanticSearch } from './useSemanticSearch'

interface ScoredResult {
  result: SearchResult
  fuzzyScore: number
  semanticScore: number
  hybridScore: number
  source: 'fuzzy' | 'semantic' | 'both'
}

const normalizeScore = (score: number, min: number, max: number): number => {
  if (max === min) return 0.5
  return (score - min) / (max - min)
}

const calculateHybridScore = (
  fuzzyScore: number, 
  semanticScore: number, 
  hasBothScores: boolean
): number => {
  if (hasBothScores) {
    const fuzzyWeight = 0.4
    const semanticWeight = 0.6
    return fuzzyScore * fuzzyWeight + semanticScore * semanticWeight
  }
  
  return fuzzyScore || semanticScore
}

const mergeResults = (
  fuzzyResults: SearchResult[], 
  semanticResults: SearchResult[]
): SearchResult[] => {
  const resultMap = new Map<string, ScoredResult>()
  
  fuzzyResults.forEach((result, index) => {
    const fuzzyScore = 1 - (index / fuzzyResults.length) * 0.5
    resultMap.set(result.id, {
      result,
      fuzzyScore,
      semanticScore: 0,
      hybridScore: fuzzyScore,
      source: 'fuzzy'
    })
  })
  
  const semanticThreshold = 0.5
  
  semanticResults.forEach((result) => {
    const existing = resultMap.get(result.id)
    const semanticScore = result.similarity || 0
    
    if (semanticScore < semanticThreshold && !existing) {
      return
    }
    
    if (existing) {
      existing.semanticScore = semanticScore
      existing.source = 'both'
      existing.hybridScore = calculateHybridScore(
        existing.fuzzyScore, 
        semanticScore, 
        true
      )
    } else if (semanticScore >= semanticThreshold) {
      resultMap.set(result.id, {
        result,
        fuzzyScore: 0,
        semanticScore,
        hybridScore: semanticScore,
        source: 'semantic'
      })
    }
  })
  
  const allScores = Array.from(resultMap.values())
  
  if (allScores.length === 0) {
    return []
  }
  
  const minScore = Math.min(...allScores.map(s => s.hybridScore))
  const maxScore = Math.max(...allScores.map(s => s.hybridScore))
  
  allScores.forEach(scored => {
    scored.hybridScore = normalizeScore(scored.hybridScore, minScore, maxScore)
  })
  
  return allScores
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .map(({ result, hybridScore, source, fuzzyScore, semanticScore }) => ({
      ...result,
      similarity: hybridScore,
      source,
      fuzzyScore,
      semanticScore
    }))
}

export const useHybridSearch = (searchQuery: Ref<string>) => {
  const debouncedQuery = refDebounced(searchQuery, 300)
  
  const { 
    results: fuzzyResults, 
    isLoading: fuzzyIsLoading 
  } = useFuzzySearch(debouncedQuery)
  
  const { 
    results: semanticResults, 
    isLoading: semanticIsLoading,
    isSupported: semanticIsSupported 
  } = useSemanticSearch(debouncedQuery)
  
  const results = computed(() => {
    if (!debouncedQuery.value?.trim()) {
      return []
    }
    
    const fuzzy = fuzzyResults.value || []
    const semantic = semanticIsSupported.value ? (semanticResults.value || []) : []
    
    if (fuzzy.length === 0 && semantic.length === 0) {
      return []
    }
    
    return mergeResults(fuzzy, semantic)
  })
  
  const isLoading = computed(() => {
    if (semanticIsSupported.value) {
      return fuzzyIsLoading.value || semanticIsLoading.value
    }
    return fuzzyIsLoading.value
  })
  
  const searchInfo = computed(() => ({
    totalFuzzyResults: fuzzyResults.value?.length || 0,
    totalSemanticResults: semanticResults.value?.length || 0,
    semanticSupported: semanticIsSupported.value,
    isHybrid: semanticIsSupported.value && 
              (fuzzyResults.value?.length || 0) > 0 && 
              (semanticResults.value?.length || 0) > 0
  }))
  
  return {
    results,
    isLoading,
    isSupported: semanticIsSupported,
    searchInfo
  }
} 