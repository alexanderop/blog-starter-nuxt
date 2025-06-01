<script setup lang="ts">
import { SHORTCUTS } from '~/config/shortcuts'
import { onKeyStroke } from '@vueuse/core'

const { isShortcutsOpen, closeShortcuts } = useShortcuts()
const shortcuts = SHORTCUTS

onKeyStroke('Escape', () => {
  closeShortcuts()
})
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isShortcutsOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeShortcuts"
    >
      <div 
        class="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
            <button
              class="text-gray-400 hover:text-white"
              @click="closeShortcuts"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <div 
              v-for="section in shortcuts" 
              :key="section.category"
              class="space-y-3"
            >
              <h3 class="text-sm font-medium text-gray-300 uppercase tracking-wide">
                {{ section.category }}
              </h3>
              <div class="space-y-2">
                <div 
                  v-for="shortcut in section.items"
                  :key="shortcut.description"
                  class="flex items-center justify-between py-2 px-3 bg-gray-700 rounded"
                >
                  <span class="text-gray-200 text-sm">{{ shortcut.description }}</span>
                  <div class="flex items-center space-x-1">
                    <template v-for="(key, index) in shortcut.keys" :key="index">
                      <kbd class="px-2 py-1 text-xs font-mono bg-gray-600 text-gray-200 rounded border border-gray-500">
                        {{ key }}
                      </kbd>
                      <span 
                        v-if="index < shortcut.keys.length - 1"
                        class="text-gray-400 text-xs"
                      >
                        +
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-700">
            <p class="text-xs text-gray-400 text-center">
              Press <kbd class="px-1 py-0.5 bg-gray-600 rounded text-xs">Esc</kbd> to close this dialog
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar {
  /* Webkit browsers (Chrome, Safari, Edge) */
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
  border: 2px solid #1f2937;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: #9ca3af;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}
</style> 