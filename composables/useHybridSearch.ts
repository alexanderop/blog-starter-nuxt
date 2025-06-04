interface Opts {
  fuzzyWeight?: number
  semanticWeight?: number
  rrfK?: number
  limit?: number
}

export const useHybridSearch = (query: Ref<string>, opts: Opts = {}) => {
  const { results: fuzzy, isLoading: fuzzyLoading } = useFuzzySearch(query)
  const {
    results: semantic,
    isLoading: semLoading,
    isSupported
  } = useSemanticSearch(query)

  const {
    fuzzyWeight = 0.5,
    semanticWeight = 0.5,
    rrfK = 60,
    limit = 20
  } = opts

  const merged = computed(() => {
    const rankedLists = [
      { items: fuzzy.value, weight: fuzzyWeight }
    ]
    
    if (isSupported.value) {
      rankedLists.push({ items: semantic.value, weight: semanticWeight })
    }
    
    return reciprocalRankFusion(rankedLists, { k: rrfK, limit })
  })

  const searchInfo = computed(() => ({
    isHybrid: isSupported.value && query.value.length > 0,
    totalFuzzyResults: fuzzy.value.length,
    totalSemanticResults: isSupported.value ? semantic.value.length : 0
  }))

  return {
    results: merged,
    isLoading: computed(() => fuzzyLoading.value || semLoading.value),
    isSupported,
    searchInfo
  }
}
