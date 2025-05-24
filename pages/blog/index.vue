<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
</script>

<template>
  <div class="min-h-screen bg-gray-50 prose">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights about web development
        </p>
      </div>
      <div class="grid gap-8 md:gap-12">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="group"
        >
          <NuxtLink 
            :to="post.path"
            class="block bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div class="space-y-4">
              <h2 class="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {{ post.title }}
              </h2>
              <p v-if="post.description" class="text-gray-600 leading-relaxed">
                {{ post.description }}
              </p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <time v-if="post.date" :datetime="post.date">
                  {{ new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) }}
                </time>
                <div v-if="post.tags && post.tags.length" class="flex gap-2">
                  <span 
                    v-for="tag in post.tags.slice(0, 3)" 
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="pt-2">
                <span class="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                  Read more →
                </span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
      <div v-if="!posts || posts.length === 0" class="text-center py-16">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p class="text-gray-600">Check back later for new content!</p>
      </div>
    </div>
  </div>
</template>
