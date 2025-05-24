<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { setupSearchShortcut } = useKeyboardShortcuts()

setupSearchShortcut()
</script>
