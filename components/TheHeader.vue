<script setup lang="ts">
const route = useRoute()

const isActive = (path: string) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}
</script>

<template>
  <header class="border-b border-gray-200 bg-white">
    <nav class="max-w-2xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-normal">
          <NuxtLink to="/" class="text-black hover:underline">
            My Blog
          </NuxtLink>
        </h1>
        
        <div class="flex space-x-6">
          <NuxtLink 
            to="/"
            :class="[
              'text-sm hover:underline',
              isActive('/') 
                ? 'text-black font-medium' 
                : 'text-gray-600'
            ]"
          >
            Home
          </NuxtLink>
          
          <NuxtLink 
            to="/blog"
            :class="[
              'text-sm hover:underline',
              isActive('/blog') 
                ? 'text-black font-medium' 
                : 'text-gray-600'
            ]"
          >
            Blog
          </NuxtLink>
          
          <NuxtLink 
            to="/search"
            :class="[
              'text-sm hover:underline',
              isActive('/search') 
                ? 'text-black font-medium' 
                : 'text-gray-600'
            ]"
          >
            Search
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>