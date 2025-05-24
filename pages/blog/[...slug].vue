<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
</script>

<template>
    <div class="bg-white">
        <div class="max-w-2xl mx-auto px-4 py-12">
            <article class="prose prose-lg prose-gray max-w-none prose-headings:font-normal prose-headings:text-black prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-black prose-a:underline hover:prose-a:no-underline prose-strong:text-black prose-code:text-black prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200">
                <ContentRenderer :value="page" />
            </article>
        </div>
    </div>
</template>
