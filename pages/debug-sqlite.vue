<script setup lang="ts">
interface FetchError extends Error {
  data?: {
    message?: string
    data?: unknown
  }
}

interface QueryOption {
  name: string
  sql: string
}

const { sqlQuery, selectQuery } = useQueryInput()
const { results, error, loading, executeQuery } = useQueryExecution()

function useQueryInput() {
  const sqlQuery = ref('SELECT sqlite_version();')
  
  function selectQuery(event: Event) {
    const target = event.target as HTMLSelectElement
    if (target.value) {
      sqlQuery.value = target.value
      target.value = ''
    }
  }
  
  return {
    sqlQuery,
    selectQuery
  }
}

function useQueryExecution() {
  const results = ref<Record<string, unknown>[] | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function executeQuery() {
    if (!sqlQuery.value.trim()) {
      error.value = 'SQL query cannot be empty.'
      results.value = null
      return
    }

    loading.value = true
    error.value = null
    results.value = null

    const { data: response, error: fetchError } = await tryCatch(
      $fetch<ApiResponse<'/api/sqlite-query', 'post'>>('/api/sqlite-query', {
        method: 'POST',
        body: { query: sqlQuery.value },
      })
    )

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      const typedError = fetchError as FetchError
      error.value = typedError.data?.message || fetchError.message || 'An unknown error occurred.'
      if (typedError.data?.data) {
        error.value += `\nDetails: ${JSON.stringify(typedError.data.data, null, 2)}`
      }
    } else if (response) {
      if ('error' in response && response.error) {
        error.value = response.error
      } else if ('data' in response) {
        results.value = response.data
      }
    }

    loading.value = false
  }
  
  return {
    results,
    error,
    loading,
    executeQuery
  }
}

function formatValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

function getCommonQueries(): QueryOption[] {
  return [
    { name: 'SQLite Version', sql: 'SELECT sqlite_version();' },
    { name: 'List All Tables', sql: "SELECT name FROM sqlite_master WHERE type='table';" },
    { name: 'Blog Posts Overview', sql: 'SELECT id, title, path, date FROM _content_blog LIMIT 5;' },
    { name: 'Blog Count', sql: 'SELECT COUNT(*) as total_posts FROM _content_blog;' },
    { name: 'Blog Schema', sql: "PRAGMA table_info(_content_blog);" },
    { name: 'Recent Posts', sql: 'SELECT title, path, date FROM _content_blog ORDER BY lastModified DESC LIMIT 3;' },
    { name: 'Posts by Date', sql: 'SELECT title, date, readingTime FROM _content_blog ORDER BY date DESC;' },
    { name: 'Reading Time Stats', sql: 'SELECT AVG(readingTime) as avg_time, MIN(readingTime) as min_time, MAX(readingTime) as max_time FROM _content_blog;' },
    { name: 'Word Count Stats', sql: 'SELECT title, wordCount FROM _content_blog ORDER BY wordCount DESC;' },
    { name: 'Tags Analysis', sql: 'SELECT title, tags FROM _content_blog WHERE tags IS NOT NULL;' },
    { name: 'Posts with Descriptions', sql: 'SELECT title, description FROM _content_blog WHERE description IS NOT NULL;' },
    { name: 'File Extensions', sql: 'SELECT DISTINCT extension FROM _content_blog;' },
    { name: 'Content Info Table', sql: 'SELECT * FROM _content_info;' },
    { name: 'Cache Table', sql: 'SELECT * FROM _development_cache LIMIT 5;' }
  ]
}

const commonQueries = getCommonQueries()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-3 py-4 max-w-7xl">
      <!-- Compact Header -->
      <div class="mb-4 text-center">
        <div class="inline-flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            SQLite Debugger
          </h1>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Execute SQL queries against your Nuxt Content database
        </p>
        <div class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-700 dark:text-orange-300">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          Dev Only
        </div>
      </div>

      <!-- Compact layout: side-by-side -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <!-- Compact Sidebar -->
        <div class="lg:col-span-1 space-y-3">
          <!-- Quick Queries -->
          <div class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <div class="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Quick Queries
              </h3>
            </div>
            
            <div class="p-2">
              <select
                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                @change="selectQuery"
              >
                <option value="" class="text-gray-500">Choose example query...</option>
                <option
                  v-for="(query, index) in commonQueries"
                  :key="index"
                  :value="query.sql"
                  class="py-1"
                >
                  {{ query.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Compact Shortcut -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 text-center">
            <kbd class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs text-blue-700 dark:text-blue-300 font-mono">Shift+Ctrl+D</kbd>
            <div class="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Shortcut</div>
          </div>

          <!-- Compact Notes -->
          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-2">
            <div class="flex items-start gap-2">
              <svg class="w-3 h-3 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <div>
                <h4 class="text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">Security</h4>
                <ul class="space-y-0.5 text-xs text-orange-700 dark:text-orange-400">
                  <li>• Dev only</li>
                  <li>• Read-only</li>
                  <li>• Tables: _content_blog</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact Main Content -->
        <div class="lg:col-span-4 space-y-3">
          <!-- Compact Query Input -->
          <div class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <div class="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h2 class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                SQL Query
              </h2>
            </div>
            
            <div class="p-3">
              <div class="relative">
                <textarea
                  id="sqlQuery"
                  v-model="sqlQuery"
                  rows="5"
                  class="w-full p-2 font-mono text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all duration-200 text-gray-900 dark:text-gray-100"
                  placeholder="SELECT title, path, date FROM _content_blog LIMIT 5;"
                />
                <div class="absolute top-1 right-1 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-1 py-0.5 rounded">
                  SQL
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-2">
                <div class="text-xs text-gray-400 dark:text-gray-500">
                  Columns: id, title, path, date, description, tags, wordCount, readingTime
                </div>
                
                <button
                  :disabled="loading || !sqlQuery.trim()"
                  class="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-xs"
                  @click="executeQuery"
                >
                  <span v-if="!loading" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                    </svg>
                    Execute
                  </span>
                  <span v-else class="flex items-center gap-1">
                    <svg class="w-3 h-3 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                    </svg>
                    Executing...
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Compact Results -->
          <div v-if="error || results">
            <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 animate-fade-in">
              <div class="flex items-start gap-2">
                <svg class="w-3 h-3 text-red-600 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1 min-w-0">
                  <h3 class="text-xs font-medium text-red-800 dark:text-red-300 mb-1">Error</h3>
                  <pre class="text-xs text-red-700 dark:text-red-400 whitespace-pre-wrap font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-x-auto">{{ error }}</pre>
                </div>
              </div>
            </div>

            <div v-if="results" class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 animate-fade-in">
              <div class="px-3 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                <h3 class="text-xs font-medium text-green-800 dark:text-green-300 flex items-center justify-between">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Results
                  </span>
                  <span class="bg-green-100 dark:bg-green-800 px-1.5 py-0.5 rounded text-xs">
                    {{ results.length }} {{ results.length === 1 ? 'row' : 'rows' }}
                  </span>
                </h3>
              </div>
              
              <div class="p-0">
                <div v-if="results.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
                  <svg class="w-6 h-6 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300">No Results</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Query executed successfully</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full text-xs">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          v-for="header in Object.keys(results[0] || {})"
                          :key="header"
                          scope="col"
                          class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                        >
                          {{ header }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800">
                      <tr 
                        v-for="(row, rowIndex) in results" 
                        :key="rowIndex"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <td
                          v-for="(value, colIndex) in row"
                          :key="colIndex"
                          class="px-2 py-1.5 text-gray-900 dark:text-gray-100"
                        >
                          <pre class="whitespace-pre-wrap font-mono text-xs text-gray-800 dark:text-gray-200 max-w-xs overflow-hidden">{{ formatValue(value) }}</pre>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 3px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f8fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 1px;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #475569;
}
</style> 