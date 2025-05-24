<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
</script>

<template>
  <div class="py-12">
    <div class="prose prose-lg prose-gray max-w-none prose-headings:font-normal prose-headings:text-white prose-p:text-gray-200 prose-p:leading-relaxed prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300 hover:prose-a:no-underline">
      <h1>Blog</h1>
      <p>Thoughts, tutorials, and insights about web development.</p>
      
      <hr class="my-8 border-gray-700">
      
      <div v-if="posts && posts.length" class="space-y-8">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="border-b border-gray-700 pb-6 last:border-b-0"
        >
          <h2 class="text-xl font-normal mb-2">
            <NuxtLink 
              :to="post.path"
              class="text-white hover:underline"
            >
              {{ post.title }}
            </NuxtLink>
          </h2>
          
          <p v-if="post.description" class="text-gray-300 mb-3 leading-relaxed">
            {{ post.description }}
          </p>
          
          <div class="flex items-center gap-4 text-sm text-gray-400">
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
                class="text-gray-400"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-300">No posts yet. Check back later for new content!</p>
      </div>
    </div>
  </div>
</template>
