<template>
  <div class="text-center py-12">
    <div 
      :class="spinnerSizeClass"
      class="inline-block animate-spin rounded-full border-b-2 border-blue-500"
    />
    <p v-if="message" class="text-gray-400 mt-2">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  size: 'md'
})

const spinnerSizeClass = computed(() => {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  return sizeMap[props.size]
})
</script> 