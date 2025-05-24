<script setup lang="ts">
const route = useRoute()

const isActive = (path: string) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <h1 class="text-xl font-bold text-gray-900">
            <NuxtLink to="/" class="hover:text-blue-600 transition-colors">
              My Blog
            </NuxtLink>
          </h1>
          
          <div class="hidden md:flex space-x-6">
            <NuxtLink 
              to="/"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              Home
            </NuxtLink>
            
            <NuxtLink 
              to="/blog"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/blog') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              Blog
            </NuxtLink>
            
            <NuxtLink 
              to="/search"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/search') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              Search
            </NuxtLink>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            type="button" 
            class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="toggle menu"
          >
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zM4 13h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zM4 21h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>