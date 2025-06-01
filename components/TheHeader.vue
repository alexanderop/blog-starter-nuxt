<script setup lang="ts">
const route = useRoute()
const { openShortcuts } = useShortcuts()

const isActive = (path: string) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}
</script>

<template>
  <header class="border-b border-gray-700 bg-gray-900">
    <nav class="max-w-2xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-normal">
          <NuxtLink to="/" class="text-white hover:underline">
            My Blog
          </NuxtLink>
        </h1>
        
        <div class="flex items-center space-x-6">
          <div class="flex space-x-6">
            <NuxtLink 
              to="/"
              :class="[
                'text-sm hover:underline',
                isActive('/') 
                  ? 'text-white font-medium' 
                  : 'text-gray-400'
              ]"
            >
              Home
            </NuxtLink>
            
            <NuxtLink 
              to="/blog"
              :class="[
                'text-sm hover:underline',
                isActive('/blog') 
                  ? 'text-white font-medium' 
                  : 'text-gray-400'
              ]"
            >
              Blog
            </NuxtLink>
            
            <NuxtLink 
              to="/search"
              :class="[
                'text-sm hover:underline',
                isActive('/search') 
                  ? 'text-white font-medium' 
                  : 'text-gray-400'
              ]"
            >
              Search
            </NuxtLink>
          </div>

          <!-- Shortcuts Button -->
          <button
            class="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm group"
            title="View keyboard shortcuts"
            @click="openShortcuts"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M7 8h.01M17 8h.01M7 16h.01M17 16h.01" />
            </svg>
            <span class="hidden sm:inline">Shortcuts</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>