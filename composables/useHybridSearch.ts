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
    const bucket: Map<string, { item: DisplaySearchResult; score: number }> = new Map()
    const add = (arr: DisplaySearchResult[], weight: number) => {
      arr.forEach((item, idx) => {
        const slug = item.slug ?? item.id
        const score = weight * (1 / (idx + rrfK))
        const prev = bucket.get(slug)
        bucket.set(slug, prev ? { item, score: prev.score + score } : { item, score })
      })
    }

    add(fuzzy.value, fuzzyWeight)
    if (isSupported.value) add(semantic.value, semanticWeight)

    return [...bucket.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item)
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
