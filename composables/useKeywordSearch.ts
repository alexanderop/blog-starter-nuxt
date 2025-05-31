export const useKeywordSearch = () => {
    const searchQuery = ref('')
    const { data: sections } =
      useAsyncData('sections', () => queryCollectionSearchSections('blog'))
  
    const results = computed(() => {
      if (!searchQuery.value.trim()) return []
      const q = searchQuery.value.toLowerCase()
      return (sections.value ?? [])
        .filter(s =>
          (s.title ?? '').toLowerCase().includes(q) ||
          (s.content ?? '').toLowerCase().includes(q)
        )
        .slice(0, 20)
    })
  
    return { searchQuery, results }
  }