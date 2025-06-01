---
title: Deep Dive into useHybridSearch Composable - Building Intelligent Search
description: A technical exploration of how the useHybridSearch composable combines fuzzy and semantic search to create a powerful, intelligent search experience.
tags: ["composables", "search", "ai", "vue", "technical"]
date: "2024-03-26"
---

# Deep Dive into useHybridSearch Composable: Building Intelligent Search

In our quest to build the ultimate search experience, we created `useHybridSearch` - a Vue composable that intelligently combines fuzzy text matching with AI-powered semantic understanding. Let's explore how it works under the hood.

## The Problem: Single Search Methods Fall Short

Traditional search methods each have limitations:
- **Keyword search** fails with typos or synonyms
- **Fuzzy search** can't understand meaning or context
- **Semantic search** might miss exact matches or struggle with technical terms

Our solution? Combine them intelligently to leverage each method's strengths while mitigating their weaknesses.

## Architecture Overview

The `useHybridSearch` composable orchestrates multiple search strategies:

```typescript
export const useHybridSearch = (searchQuery: Ref<string>) => {
  // 1. Debounce the query for performance
  const debouncedQuery = refDebounced(searchQuery, 300)
  
  // 2. Run both search methods in parallel
  const { results: fuzzyResults, isLoading: fuzzyIsLoading } = useFuzzySearch(debouncedQuery)
  const { results: semanticResults, isLoading: semanticIsLoading } = useSemanticSearch(debouncedQuery)
  
  // 3. Intelligently merge results
  const results = computed(() => mergeResults(fuzzy, semantic))
}
```

## The Scoring Algorithm

The heart of hybrid search lies in its sophisticated scoring system:

### 1. Individual Score Assignment

**Fuzzy Scoring**: Position-based ranking
```typescript
fuzzyResults.forEach((result, index) => {
  const fuzzyScore = 1 - (index / fuzzyResults.length) * 0.5
  // First result gets 1.0, last gets ~0.5
})
```

**Semantic Scoring**: Direct similarity from AI model
```typescript
const semanticScore = result.similarity || 0
// Ranges from 0 to 1 based on meaning similarity
```

### 2. Quality Filtering

We filter out low-quality semantic matches to reduce noise:
```typescript
const semanticThreshold = 0.5

// Skip purely semantic results below 50% similarity
if (semanticScore < semanticThreshold && !existing) {
  return
}
```

This ensures that semantic-only results are meaningfully related to the query.

### 3. Hybrid Score Calculation

When a result appears in both searches, we calculate a weighted score:

```typescript
const calculateHybridScore = (fuzzyScore, semanticScore, hasBothScores) => {
  if (hasBothScores) {
    const fuzzyWeight = 0.4
    const semanticWeight = 0.6
    return fuzzyScore * fuzzyWeight + semanticScore * semanticWeight
  }
  return fuzzyScore || semanticScore
}
```

The 40/60 split favors semantic understanding while still valuing text matching.

### 4. Score Normalization

To ensure fair comparison, all scores are normalized:

```typescript
const normalizeScore = (score, min, max) => {
  if (max === min) return 0.5
  return (score - min) / (max - min)
}
```

This maps all scores to a 0-1 range for consistent ranking.

## The Merge Strategy

The `mergeResults` function implements a sophisticated deduplication and ranking strategy:

```typescript
interface ScoredResult {
  result: SearchResult
  fuzzyScore: number
  semanticScore: number
  hybridScore: number
  source: 'fuzzy' | 'semantic' | 'both'
}
```

Results are tracked by their unique ID, allowing us to:
1. Detect overlaps between search methods
2. Combine scores appropriately
3. Track the source for debugging

## Reactive State Management

The composable provides rich state information:

```typescript
const searchInfo = computed(() => ({
  totalFuzzyResults: fuzzyResults.value?.length || 0,
  totalSemanticResults: semanticResults.value?.length || 0,
  semanticSupported: semanticIsSupported.value,
  isHybrid: semanticIsSupported.value && 
            fuzzyResults.value?.length > 0 && 
            semanticResults.value?.length > 0
}))
```

This enables UI components to show users exactly what's happening behind the scenes.

## Graceful Degradation

When semantic search isn't available (server-side rendering or older browsers), the composable gracefully falls back:

```typescript
const results = computed(() => {
  const fuzzy = fuzzyResults.value || []
  const semantic = semanticIsSupported.value ? (semanticResults.value || []) : []
  
  if (fuzzy.length === 0 && semantic.length === 0) {
    return []
  }
  
  return mergeResults(fuzzy, semantic)
})
```

## Performance Considerations

### 1. **Debouncing**
We debounce the search query to avoid excessive API calls:
```typescript
const debouncedQuery = refDebounced(searchQuery, 300)
```

### 2. **Parallel Execution**
Both search methods run simultaneously, not sequentially, reducing total search time.

### 3. **Computed Caching**
Vue's computed properties ensure results are only recalculated when dependencies change.

## Usage in Components

Using the composable is straightforward:

```vue
<script setup>
const searchQuery = ref('')
const { 
  results, 
  isLoading, 
  isSupported,
  searchInfo 
} = useHybridSearch(searchQuery)
</script>

<template>
  <input v-model="searchQuery" placeholder="Search...">
  
  <div v-if="searchInfo.isHybrid">
    Searching {{ searchInfo.totalFuzzyResults }} fuzzy matches
    and {{ searchInfo.totalSemanticResults }} semantic matches
  </div>
  
  <SearchResults :results="results" :loading="isLoading" />
</template>
```

## Real-World Impact

Here's how hybrid search improves common scenarios:

### Scenario 1: Technical Typo
Query: "compsables vue"
- Fuzzy finds "composables" despite typo ✓
- Semantic understands Vue context ✓
- Hybrid gives high score to relevant results ✓

### Scenario 2: Conceptual Search  
Query: "making websites interactive"
- Fuzzy finds limited matches ⚠️
- Semantic finds Vue/Nuxt content ✓
- Hybrid ensures best matches surface ✓

### Scenario 3: Exact Technical Term
Query: "defineProps"
- Fuzzy finds exact matches ✓
- Semantic finds related Vue content ✓
- Hybrid boosts exact matches appropriately ✓

## Future Enhancements

Potential improvements to consider:

1. **Adaptive Weighting**: Adjust fuzzy/semantic weights based on query type
2. **Query Analysis**: Detect if query is more technical vs conceptual
3. **User Feedback Loop**: Learn from clicks to improve ranking
4. **Multi-language Support**: Extend semantic understanding across languages

## Key Takeaways

1. **Hybrid search isn't just running two searches** - it's about intelligent result merging
2. **Scoring must be normalized** for fair comparison across methods
3. **Quality thresholds prevent noise** while maintaining relevant results
4. **Graceful degradation** ensures usability across all environments
5. **Performance matters** - debouncing and parallel execution are crucial

## Conclusion

The `useHybridSearch` composable demonstrates how modern Vue composition API enables us to build sophisticated features with clean, maintainable code. By combining multiple search strategies intelligently, we create a search experience that's both forgiving and smart - understanding what users mean, not just what they type.

Want to implement something similar? The key is starting simple (combine two methods) and iterating based on real user behavior. Happy coding! 🚀 