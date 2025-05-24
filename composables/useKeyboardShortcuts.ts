interface KeyboardShortcut {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: (event: KeyboardEvent) => void
  preventDefault?: boolean
}

/**
 * Composable for managing global keyboard shortcuts
 * 
 * @example
 * ```ts
 * const { setupSearchShortcut } = useKeyboardShortcuts()
 * 
 * // Setup search shortcut (automatically handles lifecycle)
 * setupSearchShortcut()
 * ```
 */
export const useKeyboardShortcuts = () => {
  const shortcuts = ref<KeyboardShortcut[]>([])

  const addShortcut = (shortcut: KeyboardShortcut) => {
    shortcuts.value.push(shortcut)
  }

  const clearShortcuts = () => {
    shortcuts.value = []
  }

  const handleKeydown = (event: KeyboardEvent) => {
    shortcuts.value.forEach(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase()
      
      // Check modifiers - if the shortcut specifies a modifier, it must be pressed
      // If it doesn't specify a modifier, that modifier should NOT be pressed
      const metaMatch = shortcut.metaKey ? event.metaKey : true
      const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : true  
      const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey
      const altMatch = shortcut.altKey ? event.altKey : !event.altKey

      // Special handling for Cmd+K / Ctrl+K - either meta OR ctrl should work
      let modifierMatch = metaMatch && ctrlMatch && shiftMatch && altMatch
      
      if (shortcut.key === 'k' && (shortcut.metaKey || shortcut.ctrlKey)) {
        modifierMatch = (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey
      }

      if (keyMatch && modifierMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }
        shortcut.callback(event)
      }
    })
  }

  const setupGlobalShortcuts = () => {
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      clearShortcuts()
    })
  }

  /**
   * Sets up the search shortcut (Cmd+K / Ctrl+K) to navigate to /search
   * Automatically handles mounting and unmounting of event listeners
   */
  const setupSearchShortcut = () => {
    addShortcut({
      key: 'k',
      metaKey: true,
      ctrlKey: true, // This enables both Cmd+K and Ctrl+K
      callback: () => navigateTo('/search'),
      preventDefault: true
    })

    setupGlobalShortcuts()
  }

  return {
    addShortcut,
    clearShortcuts,
    setupGlobalShortcuts,
    setupSearchShortcut
  }
} 