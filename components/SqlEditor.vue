<script setup lang="ts">
import Prism from 'prismjs'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism-tomorrow.css'

const { 
  modelValue, 
  placeholder = 'Enter SQL query...', 
  disabled = false,
  rows = 5 
} = defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  rows?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'execute': []
}>()

const textareaRef = useTemplateRef('textarea')
const codeRef = useTemplateRef('code')

const internalValue = computed({
  get: () => modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const highlightedCode = computed(() => {
  if (!modelValue) return ''
  try {
    return Prism.highlight(modelValue, Prism.languages.sql || {}, 'sql')
  } catch (error) {
    console.warn('Prism highlighting failed:', error)
    return modelValue
  }
})

const updateScroll = () => {
  if (textareaRef.value && codeRef.value) {
    codeRef.value.scrollTop = textareaRef.value.scrollTop
    codeRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Execute on Ctrl+Enter or Cmd+Enter
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    emit('execute')
    return
  }
  
  // Tab indentation
  if (event.key === 'Tab') {
    event.preventDefault()
    const textarea = textareaRef.value
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = textarea.value
    
    if (event.shiftKey) {
      // Shift+Tab: Remove indentation
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd = value.indexOf('\n', end)
      const endPos = lineEnd === -1 ? value.length : lineEnd
      
      const selectedLines = value.substring(lineStart, endPos)
      const unindentedLines = selectedLines.replace(/^ {2}/gm, '')
      
      const newValue = value.substring(0, lineStart) + unindentedLines + value.substring(endPos)
      internalValue.value = newValue
      
      nextTick(() => {
        const reduction = selectedLines.length - unindentedLines.length
        textarea.selectionStart = Math.max(lineStart, start - 2)
        textarea.selectionEnd = Math.max(start, end - reduction)
      })
    } else {
      // Tab: Add indentation
      if (start === end) {
        // Single cursor - insert 2 spaces
        const newValue = value.substring(0, start) + '  ' + value.substring(end)
        internalValue.value = newValue
        
        nextTick(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        })
      } else {
        // Selection - indent all selected lines
        const lineStart = value.lastIndexOf('\n', start - 1) + 1
        const lineEnd = value.indexOf('\n', end)
        const endPos = lineEnd === -1 ? value.length : lineEnd
        
        const selectedLines = value.substring(lineStart, endPos)
        const indentedLines = selectedLines.replace(/^/gm, '  ')
        
        const newValue = value.substring(0, lineStart) + indentedLines + value.substring(endPos)
        internalValue.value = newValue
        
        nextTick(() => {
          const addition = indentedLines.length - selectedLines.length
          textarea.selectionStart = start + 2
          textarea.selectionEnd = end + addition
        })
      }
    }
  }
}

onMounted(() => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.addEventListener('scroll', updateScroll)
    }
  })
})

onUnmounted(() => {
  if (textareaRef.value) {
    textareaRef.value.removeEventListener('scroll', updateScroll)
  }
})
</script>

<template>
  <div class="relative font-mono text-sm">
    <!-- Highlighted code background -->
    <pre 
      ref="code"
      class="absolute inset-0 p-3 m-0 overflow-hidden whitespace-pre-wrap break-words bg-gray-900 dark:bg-gray-950 pointer-events-none border border-gray-300 dark:border-gray-600 rounded-md"
      aria-hidden="true"
    ><code 
      class="language-sql text-gray-100"
      v-html="highlightedCode || ' '"
    /></pre>
    
    <!-- Invisible textarea for input -->
    <textarea
      ref="textarea"
      v-model="internalValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="relative z-10 w-full p-3 font-mono text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all duration-200"
      :class="[
        modelValue ? 'text-transparent caret-white selection:bg-blue-500/30' : 'text-gray-300 placeholder-gray-400'
      ]"
      spellcheck="false"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      @keydown="handleKeyDown"
    />
    
    <!-- SQL label and shortcuts -->
    <div class="absolute top-1 right-1 flex items-center gap-2 pointer-events-none">
      <div class="text-xs text-gray-400 dark:text-gray-500 bg-gray-900/80 dark:bg-gray-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs">
        SQL
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for dark theme */
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

textarea::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Ensure consistent font rendering */
pre, textarea {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  line-height: 1.5;
  tab-size: 2;
  -moz-tab-size: 2;
}

/* Hide default textarea outline when focused */
textarea:focus {
  outline: none;
}
</style> 