<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <article class="prosa max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 sm:p-12">
                <ContentRenderer :value="page" prose />
            </article>
        </div>
    </div>
</template>
