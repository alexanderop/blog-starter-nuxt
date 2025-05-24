<script setup lang="ts">
const route = useRoute()

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
      </div>
    </nav>
  </header>
</template>