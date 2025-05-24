---
title: Understanding the useSearch Composable
description: Deep dive into how the custom search functionality works in our Nuxt blog, including scoring algorithms, debouncing, and real-time filtering.
tags: ["nuxt", "vue", "composables", "search", "typescript"]
date: "2024-03-23"
---

# Understanding the useSearch Composable

Building effective search functionality is crucial for content-heavy applications. In this blog, we've implemented a powerful **custom search composable** that provides real-time, scored search results across our content. Let's dive deep into how it works!

## Overview

The `useSearch` composable is a Vue 3 composition function that provides comprehensive search capabilities for our Nuxt Content blog. It handles everything from data fetching to result scoring, debouncing, and text highlighting.

## Key Features

### 🎯 Smart Scoring Algorithm
Our search doesn't just match text—it intelligently scores results:
- **Title matches**: 10 points (highest priority)
- **Tag matches**: 7 points  
- **Description matches**: 5 points
- **Content matches**: 3 points (lowest priority)

### ⚡ Performance Optimizations
- **Debounced search**: Prevents excessive API calls during typing
- **Async data loading**: Non-blocking content fetching
- **Result limiting**: Configurable maximum results (default: 20)

### 🎨 Enhanced UX
- **Text highlighting**: Search terms are visually highlighted in results
- **Content previews**: Automatic truncation with ellipsis
- **Date formatting**: User-friendly date display
- **Loading states**: Visual feedback during search operations

## Core Architecture

### Interface Definitions

```typescript
interface SearchSection {
  id: string
  title?: string
  content?: string
  description?: string
  tags?: string[]
  date?: string
  score?: number
}

interface UseSearchOptions {
  collection?: 'blog'
  debounceDelay?: number
  maxResults?: number
}
```

### The Search Scoring Algorithm

The heart of our search functionality lies in the scoring system:

```typescript
const calculateSearchScore = (section: SearchSection, query: string): number => {
  let score = 0
  const normalizedQuery = query.toLowerCase()
  
  const titleMatch = section.title?.toLowerCase().includes(normalizedQuery)
  const contentMatch = section.content?.toLowerCase().includes(normalizedQuery)
  const descriptionMatch = section.description?.toLowerCase().includes(normalizedQuery)
  const tagMatch = section.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
  
  if (titleMatch) score += 10
  if (descriptionMatch) score += 5
  if (contentMatch) score += 3
  if (tagMatch) score += 7
  
  return score
}
```

This scoring system ensures that:
1. **Titles** get the highest priority (users often search for specific topics)
2. **Tags** are highly valued (they represent key categories)
3. **Descriptions** provide good context matching
4. **Content** matches are included but weighted lower (to avoid noise)

## Search Operation Flow

### 1. Data Fetching
```typescript
const { data: searchData } = await useAsyncData(`search-sections-${collection}`, () => 
  queryCollectionSearchSections(collection)
)
```

The composable uses Nuxt's `useAsyncData` to fetch and cache search data efficiently.

### 2. Search Processing
```typescript
const performSearchOperation = (
  sections: SearchSection[], 
  query: string, 
  maxResults: number
): SearchSection[] => {
  if (!query.trim()) return []
  
  const normalizedQuery = query.toLowerCase().trim()
  
  return sections
    .map(section => ({
      ...section,
      score: calculateSearchScore(section, normalizedQuery)
    }))
    .filter(section => section.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
}
```

The search process:
1. **Normalizes** the query (lowercase, trimmed)
2. **Scores** each section
3. **Filters** out zero-score results
4. **Sorts** by score (highest first)
5. **Limits** results to prevent overwhelming the UI

### 3. Debounced Execution
```typescript
const createDebouncedFunction = (fn: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, delay)
  }
}
```

Debouncing prevents excessive search operations while the user is typing, improving performance and user experience.

## Text Processing Features

### Content Preview Generation
```typescript
const createContentPreview = (content: string): string => {
  if (!content) return ''
  const cleaned = content.replace(/[#*`]/g, '').trim()
  return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned
}
```

This function:
- Removes Markdown formatting characters
- Truncates long content to 150 characters
- Adds ellipsis for truncated content

### Text Highlighting
```typescript
const createHighlightedText = (text: string, query: string): string => {
  if (!text || !query) return text
  
  const escapedText = escapeHtml(text)
  const escapedQuery = escapeHtml(query.trim())
  
  if (!escapedQuery) return escapedText
  
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  
  return escapedText.replace(regex, '<mark class="bg-yellow-400 text-gray-900 px-1 rounded">$1</mark>')
}
```

The highlighting feature:
- **Escapes HTML** to prevent XSS attacks
- **Escapes regex** special characters
- **Case-insensitive** matching
- **Applies styling** with Tailwind CSS classes

## Usage Example

```vue
<script setup>
const { 
  searchQuery, 
  searchResults, 
  isLoading, 
  handleSearch, 
  clearSearch,
  highlightText,
  getContentPreview,
  formatDate 
} = await useSearch({
  collection: 'blog',
  debounceDelay: 300,
  maxResults: 10
})
</script>

<template>
  <div>
    <input 
      v-model="searchQuery" 
      @input="handleSearch"
      placeholder="Search posts..."
    />
    
    <div v-if="isLoading">Searching...</div>
    
    <div v-for="result in searchResults" :key="result.id">
      <h3 v-html="highlightText(result.title, searchQuery)" />
      <p>{{ getContentPreview(result.content) }}</p>
      <small>{{ formatDate(result.date) }}</small>
    </div>
  </div>
</template>
```

## Benefits of This Approach

### 🔍 **Relevance-Based Results**
Unlike simple text matching, our scoring system ensures the most relevant content appears first.

### 🚀 **Performance Optimized**
Debouncing and result limiting keep the search responsive even with large content collections.

### 🛡️ **Security Conscious**
HTML escaping prevents XSS attacks when highlighting search terms.

### 🎨 **UI/UX Focused**
Built-in text highlighting, content previews, and loading states enhance the user experience.

### 🔧 **Highly Configurable**
Customizable debounce delays, result limits, and collection targeting make it adaptable to different use cases.

## Conclusion

The `useSearch` composable demonstrates how thoughtful architecture can create powerful, user-friendly search functionality. By combining Vue 3's composition API with smart scoring algorithms and performance optimizations, we've built a search system that's both powerful and pleasant to use.

The modular design makes it easy to extend—you could add features like search history, autocomplete suggestions, or even more sophisticated scoring algorithms based on user behavior.

Want to see this in action? Try searching for any term in our blog's search bar above! 🔍 