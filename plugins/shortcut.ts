export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { openShortcuts, isShortcutsOpen } = useShortcuts()
  const keys = useMagicKeys({ passive: false })
  const activeElement = useActiveElement()
  
  const notUsingInput = computed(() =>
    activeElement.value?.tagName !== 'INPUT'
    && activeElement.value?.tagName !== 'TEXTAREA'
    && !activeElement.value?.hasAttribute('contenteditable')
  )
  
  const getScrollTarget = () => {
    if (isShortcutsOpen.value) {
      return document.querySelector('.custom-scrollbar')
    }
    return window
  }
  
  const shortcutMap = getShortcutMap()

  // Handle all shortcuts from the shared constant
  for (const [keyCombo, action] of Object.entries(shortcutMap)) {
    const keyPressed = keys[keyCombo]
    
    whenever(logicAnd(keyPressed, notUsingInput), () => {
      switch (action.type) {
        case 'navigate':
          if (action.target) {
            router.push(action.target)
          }
          break
          
        case 'scroll':
          const scrollTarget = getScrollTarget()
          
          if (action.target === 'top') {
            if (scrollTarget === window) {
              window.scrollTo(0, 0)
            } else {
              scrollTarget?.scrollTo?.(0, 0)
            }
          } else if (action.target === 'bottom') {
            if (scrollTarget === window) {
              window.scrollTo(0, document.body.scrollHeight)
            } else {
              scrollTarget?.scrollTo?.(0, scrollTarget.scrollHeight)
            }
          } else if (action.scrollAmount) {
            if (scrollTarget === window) {
              window.scrollBy(0, action.scrollAmount)
            } else {
              scrollTarget?.scrollBy?.(0, action.scrollAmount)
            }
          }
          break
          
        case 'external':
          if (action.target) {
            window.open(action.target, '_blank')
          }
          break
          
        case 'shortcuts':
          openShortcuts()
          break
      }
    })
  }
})
