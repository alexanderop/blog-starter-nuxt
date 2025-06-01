<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Query all blog posts to check embedding status
const { data: allPosts } = await useAsyncData('all-blog-posts', () =>
  queryCollection('blog').all()
);

if (allPosts.value) {
  const tableData = allPosts.value.map((post, index) => ({
    '#': index + 1,
    'Title': post.title,
    'Path': post.path || 'N/A',
    'Has Embedding': post.embedding ? '✅ Yes' : '❌ No',
    'Embedding Length': post.embedding?.length || 0,
    'First 5 Values': post.embedding?.slice(0, 5)?.map(n => n.toFixed(4)).join(', ') || 'None',
    'Error': post.embeddingError || 'None'
  }));
  
  console.table(tableData);
}
</script>
