export interface ShortcutAction {
  type: 'navigate' | 'scroll' | 'external' | 'shortcuts'
  target?: string
  scrollAmount?: number
}

export interface ShortcutItem {
  keys: string[]
  keyCombo: string
  description: string
  action: ShortcutAction
}

export interface ShortcutCategory {
  category: string
  items: ShortcutItem[]
}

export const SHORTCUTS: ShortcutCategory[] = [
  {
    category: 'Navigation',
    items: [
      {
        keys: ['G', 'H'],
        keyCombo: 'g+h',
        description: 'Go to Home',
        action: { type: 'navigate', target: '/' }
      },
      {
        keys: ['G', 'B'],
        keyCombo: 'g+b',
        description: 'Go to Blog',
        action: { type: 'navigate', target: '/blog' }
      },
      {
        keys: ['G', 'S'],
        keyCombo: 'g+s',
        description: 'Go to Search',
        action: { type: 'navigate', target: '/search' }
      }
    ]
  },
  {
    category: 'Quick Actions',
    items: [
      {
        keys: ['?'],
        keyCombo: '?',
        description: 'Show Keyboard Shortcuts',
        action: { type: 'shortcuts' }
      },
      {
        keys: ['/'],
        keyCombo: '/',
        description: 'Open Search',
        action: { type: 'navigate', target: '/search' }
      },
      {
        keys: ['⌘', 'K'],
        keyCombo: 'cmd+k',
        description: 'Command Palette Search (Mac)',
        action: { type: 'navigate', target: '/search' }
      },
      {
        keys: ['Ctrl', 'K'],
        keyCombo: 'ctrl+k',
        description: 'Command Palette Search (PC)',
        action: { type: 'navigate', target: '/search' }
      }
    ]
  },
  {
    category: 'Quick Navigation',
    items: [
      {
        keys: ['O', 'H'],
        keyCombo: 'o+h',
        description: 'Open Home',
        action: { type: 'navigate', target: '/' }
      },
      {
        keys: ['O', 'B'],
        keyCombo: 'o+b',
        description: 'Open Blog',
        action: { type: 'navigate', target: '/blog' }
      },
      {
        keys: ['O', 'S'],
        keyCombo: 'o+s',
        description: 'Open Search',
        action: { type: 'navigate', target: '/search' }
      }
    ]
  },
  {
    category: 'Scrolling',
    items: [
      {
        keys: ['J'],
        keyCombo: 'j',
        description: 'Scroll Down',
        action: { type: 'scroll', scrollAmount: 100 }
      },
      {
        keys: ['K'],
        keyCombo: 'k',
        description: 'Scroll Up',
        action: { type: 'scroll', scrollAmount: -100 }
      },
      {
        keys: ['G', 'G'],
        keyCombo: 'g+g',
        description: 'Go to Top',
        action: { type: 'scroll', target: 'top' }
      },
      {
        keys: ['⇧', 'G'],
        keyCombo: 'shift+g',
        description: 'Go to Bottom',
        action: { type: 'scroll', target: 'bottom' }
      }
    ]
  },
  {
    category: 'External',
    items: [
      {
        keys: ['⇧', 'Ctrl', 'A'],
        keyCombo: 'shift+ctrl+a',
        description: 'Open Portfolio',
        action: { type: 'external', target: 'https://alexop.dev/' }
      },
      {
        keys: ['⇧', 'Ctrl', 'D'],
        keyCombo: 'shift+ctrl+d',
        description: 'SQLite Debugger (Dev)',
        action: { type: 'navigate', target: '/debug-sqlite' }
      }
    ]
  }
]

export const getShortcutMap = () => {
  const map: Record<string, ShortcutAction> = {}
  
  SHORTCUTS.forEach(category => {
    category.items.forEach(item => {
      map[item.keyCombo] = item.action
    })
  })
  
  return map
} 