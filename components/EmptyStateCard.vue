<template>
  <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <div :class="iconColorClass" class="mb-2">{{ icon }}</div>
    <div class="text-sm text-gray-300">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  description: string
  variant?: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
}

const { icon, description, variant = 'blue' } = defineProps<Props>()

const iconColorClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400'
  } as const
  return colorMap[variant]
})
</script> 