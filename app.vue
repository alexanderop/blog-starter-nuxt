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
    'embeddings': post.embeddings,
    'rawbody': post.rawbody?.slice(0, 20) || 'N/A',
    'Has Embeddings': post.embeddings ? '✅ Yes' : '❌ No',
    'Embeddings Count': post.embeddings?.length || 0,
    'First Embedding Vector Length': post.embeddings?.[0]?.vector?.length || 0,
    'First 5 Values': post.embeddings?.[0]?.vector?.slice(0, 5)?.map((n: number) => n.toFixed(4)).join(', ') || 'None',
    'Error': post.embeddingError || 'None'
  }));
  
  console.table(tableData);
}
</script>
