import Fuse from 'fuse.js'

export const useFuzzySearch = async () => {
  const searchQuery = ref('')

  const { data } = await useAsyncData('search-data', () => queryCollectionSearchSections('blog'))
  
  const fuse = computed(() => {
    if (!data.value) return null
    return new Fuse(data.value, {
      keys: ['title', 'content', 'tags'],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      ignoreLocation: true,
      findAllMatches: true,
      useExtendedSearch: true
    })
  })
  
  const results = computed(() => {
    if (!fuse.value || !searchQuery.value) return []
    return fuse.value.search(searchQuery.value).slice(0, 10).map(result => result.item)
  })
  
  return { searchQuery, results }
}