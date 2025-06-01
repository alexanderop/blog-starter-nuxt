export const useShortcuts = () => {
  const isShortcutsOpen = useState('shortcuts.isOpen', () => false)

  const openShortcuts = () => {
    isShortcutsOpen.value = true
  }

  const closeShortcuts = () => {
    isShortcutsOpen.value = false
  }

  const toggleShortcuts = () => {
    isShortcutsOpen.value = !isShortcutsOpen.value
  }

  return {
    isShortcutsOpen: readonly(isShortcutsOpen),
    openShortcuts,
    closeShortcuts,
    toggleShortcuts
  }
} 