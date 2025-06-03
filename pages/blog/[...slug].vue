<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
</script>

<template>
    <div class="bg-gray-900">
        <div class="max-w-2xl mx-auto px-4 py-12">
            <article class="prose prose-lg prose-gray max-w-none prose-headings:font-normal prose-headings:text-white prose-p:text-gray-200 prose-p:leading-relaxed prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300 hover:prose-a:no-underline prose-strong:text-white prose-code:text-gray-100 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
                <ContentRenderer v-if="page" :value="page" />
            </article>
        </div>
    </div>
</template>
