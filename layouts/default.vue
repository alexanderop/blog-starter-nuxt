<template>
    <div class="min-h-screen bg-gray-900">
      <TheHeader />
      <main class="max-w-2xl mx-auto px-4">
        <slot />
      </main>
      <BaseShortcutInfo />
    </div>
  </template>