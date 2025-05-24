<template>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Welcome to My Blog</h1>
      <div class="prose prose-lg max-w-none">
        <p class="text-xl text-gray-600 mb-6">
          A modern blog built with Nuxt 3, Nuxt Content, and Tailwind CSS.
        </p>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-xl font-semibold mb-3">📝 Latest Posts</h2>
            <p class="text-gray-600 mb-4">
              Discover our latest articles and insights.
            </p>
            <NuxtLink 
              to="/blog" 
              class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View Blog →
            </NuxtLink>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-xl font-semibold mb-3">🔍 Search</h2>
            <p class="text-gray-600 mb-4">
              Find specific content with our fuzzy search.
            </p>
            <NuxtLink 
              to="/search" 
              class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Search Posts →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>