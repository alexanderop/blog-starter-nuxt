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
    { name: 'Cache Table', sql: 'SELECT * FROM _development_cache LIMIT 5;' },
    
    // New Semantic Embeddings Queries
    { 
      name: '🧠 Embeddings Status Overview', 
      sql: `SELECT 
        title, 
        path,
        CASE 
          WHEN embeddings IS NOT NULL THEN 
            '✅ Has ' || json_array_length(embeddings) || ' chunks'
          ELSE '❌ No embeddings' 
        END as embedding_status,
        CASE 
          WHEN embeddingError IS NOT NULL THEN '⚠️ ' || embeddingError 
          ELSE '✅ No errors' 
        END as error_status
      FROM _content_blog 
      ORDER BY embedding_status DESC;` 
    },
    
    { 
      name: '📊 Semantic Chunk Types Distribution', 
      sql: `WITH chunk_data AS (
        SELECT 
          title,
          json_each.value as chunk_json
        FROM _content_blog, json_each(embeddings)
        WHERE embeddings IS NOT NULL
      ),
      chunk_types AS (
        SELECT 
          title,
          json_extract(chunk_json, '$.type') as chunk_type,
          json_extract(chunk_json, '$.level') as chunk_level,
          length(json_extract(chunk_json, '$.text')) as text_length
        FROM chunk_data
      )
      SELECT 
        chunk_type,
        COUNT(*) as count,
        AVG(text_length) as avg_text_length,
        MIN(text_length) as min_length,
        MAX(text_length) as max_length
      FROM chunk_types 
      GROUP BY chunk_type 
      ORDER BY count DESC;` 
    },
    
    { 
      name: '🎯 Chunk Details by Post', 
      sql: `WITH chunk_data AS (
        SELECT 
          title,
          path,
          json_each.value as chunk_json
        FROM _content_blog, json_each(embeddings)
        WHERE embeddings IS NOT NULL
      )
      SELECT 
        title,
        json_extract(chunk_json, '$.type') as type,
        CASE 
          WHEN json_extract(chunk_json, '$.level') IS NOT NULL 
          THEN 'H' || json_extract(chunk_json, '$.level')
          ELSE '-'
        END as level,
        length(json_extract(chunk_json, '$.text')) as chars,
        substr(json_extract(chunk_json, '$.text'), 1, 100) || '...' as preview,
        json_extract(chunk_json, '$.id') as chunk_id
      FROM chunk_data 
      ORDER BY title, type, level;` 
    },
    
    { 
      name: '🔍 Find Similar Chunks (Simple)', 
      sql: `WITH chunk_pairs AS (
        SELECT 
          a.title as post_a,
          json_extract(a_chunk.value, '$.type') as type_a,
          json_extract(a_chunk.value, '$.text') as text_a,
          json_extract(a_chunk.value, '$.id') as id_a,
          b.title as post_b,
          json_extract(b_chunk.value, '$.type') as type_b,
          json_extract(b_chunk.value, '$.text') as text_b,
          json_extract(b_chunk.value, '$.id') as id_b,
          json_extract(a_chunk.value, '$.vector') as vector_a,
          json_extract(b_chunk.value, '$.vector') as vector_b
        FROM _content_blog a, json_each(a.embeddings) a_chunk
        CROSS JOIN _content_blog b, json_each(b.embeddings) b_chunk
        WHERE a.id != b.id 
          AND a.embeddings IS NOT NULL 
          AND b.embeddings IS NOT NULL
          AND json_extract(a_chunk.value, '$.id') != json_extract(b_chunk.value, '$.id')
      ),
      similarity_calc AS (
        SELECT 
          post_a,
          type_a,
          substr(text_a, 1, 50) || '...' as preview_a,
          post_b,
          type_b,
          substr(text_b, 1, 50) || '...' as preview_b,
          -- Simple dot product of first 5 dimensions for performance
          (
            CAST(json_extract(vector_a, '$[0]') AS REAL) * CAST(json_extract(vector_b, '$[0]') AS REAL) +
            CAST(json_extract(vector_a, '$[1]') AS REAL) * CAST(json_extract(vector_b, '$[1]') AS REAL) +
            CAST(json_extract(vector_a, '$[2]') AS REAL) * CAST(json_extract(vector_b, '$[2]') AS REAL) +
            CAST(json_extract(vector_a, '$[3]') AS REAL) * CAST(json_extract(vector_b, '$[3]') AS REAL) +
            CAST(json_extract(vector_a, '$[4]') AS REAL) * CAST(json_extract(vector_b, '$[4]') AS REAL)
          ) as similarity_score
        FROM chunk_pairs
        WHERE vector_a IS NOT NULL AND vector_b IS NOT NULL
          AND json_array_length(vector_a) >= 5
          AND json_array_length(vector_b) >= 5
      )
      SELECT 
        post_a || ' [' || type_a || ']' as "Source",
        post_b || ' [' || type_b || ']' as "Similar To",
        ROUND(similarity_score, 4) as similarity,
        CASE 
          WHEN similarity_score > 0.8 THEN '🔥 Very Similar'
          WHEN similarity_score > 0.5 THEN '✨ Similar' 
          WHEN similarity_score > 0.2 THEN '👀 Somewhat Similar'
          ELSE '📄 Different'
        END as level,
        preview_a as "Text A",
        preview_b as "Text B"
      FROM similarity_calc
      WHERE similarity_score > 0.1
      ORDER BY similarity_score DESC
      LIMIT 20;` 
    },
    
    { 
      name: '🐛 Debug: Check Embeddings Data', 
      sql: `SELECT 
        title,
        CASE 
          WHEN embeddings IS NULL THEN 'NULL'
          WHEN embeddings = '' THEN 'EMPTY STRING'
          WHEN json_valid(embeddings) = 0 THEN 'INVALID JSON'
          ELSE 'VALID: ' || json_array_length(embeddings) || ' chunks'
        END as embeddings_status,
        CASE 
          WHEN embeddings IS NOT NULL AND json_valid(embeddings) = 1 AND json_array_length(embeddings) > 0 THEN
            json_extract(embeddings, '$[0].type') || ' - ' || 
            COALESCE(json_array_length(json_extract(embeddings, '$[0].vector')), 'NO_VECTOR') || ' dims'
          ELSE 'N/A'
        END as first_chunk_info
      FROM _content_blog
      ORDER BY embeddings_status DESC;` 
    },
    
    { 
      name: '🔧 Debug: Sample Embedding Vectors', 
      sql: `SELECT 
        title,
        json_extract(chunk.value, '$.type') as chunk_type,
        json_extract(chunk.value, '$.id') as chunk_id,
        json_array_length(json_extract(chunk.value, '$.vector')) as vector_length,
        CASE 
          WHEN json_array_length(json_extract(chunk.value, '$.vector')) >= 5 THEN
            '[' || 
            json_extract(chunk.value, '$.vector[0]') || ', ' ||
            json_extract(chunk.value, '$.vector[1]') || ', ' ||
            json_extract(chunk.value, '$.vector[2]') || ', ' ||
            json_extract(chunk.value, '$.vector[3]') || ', ' ||
            json_extract(chunk.value, '$.vector[4]') || ', ...]'
          ELSE 'INSUFFICIENT_DIMS'
        END as vector_sample
      FROM _content_blog, json_each(embeddings) chunk
      WHERE embeddings IS NOT NULL 
        AND json_valid(embeddings) = 1
      LIMIT 10;` 
    },
    
    { 
      name: '🚀 Simple Chunk Similarity Test', 
      sql: `-- Test with just first 2 chunks from same post and different posts
      WITH sample_chunks AS (
        SELECT 
          ROW_NUMBER() OVER() as row_num,
          title,
          json_extract(chunk.value, '$.type') as chunk_type,
          json_extract(chunk.value, '$.text') as chunk_text,
          json_extract(chunk.value, '$.vector') as chunk_vector
        FROM _content_blog, json_each(embeddings) chunk
        WHERE embeddings IS NOT NULL 
          AND json_valid(embeddings) = 1
          AND json_array_length(json_extract(chunk.value, '$.vector')) >= 5
        LIMIT 4
      )
      SELECT 
        a.title as "Post A",
        a.chunk_type as "Type A", 
        substr(a.chunk_text, 1, 40) || '...' as "Text A",
        b.title as "Post B",
        b.chunk_type as "Type B",
        substr(b.chunk_text, 1, 40) || '...' as "Text B",
        ROUND(
          (
            CAST(json_extract(a.chunk_vector, '$[0]') AS REAL) * CAST(json_extract(b.chunk_vector, '$[0]') AS REAL) +
            CAST(json_extract(a.chunk_vector, '$[1]') AS REAL) * CAST(json_extract(b.chunk_vector, '$[1]') AS REAL) +
            CAST(json_extract(a.chunk_vector, '$[2]') AS REAL) * CAST(json_extract(b.chunk_vector, '$[2]') AS REAL)
          ), 4
        ) as similarity
      FROM sample_chunks a
      CROSS JOIN sample_chunks b  
      WHERE a.row_num != b.row_num;` 
    },
    
    { 
      name: '📈 Embedding Vector Analysis', 
      sql: `WITH vector_stats AS (
        SELECT 
          title,
          json_extract(chunk.value, '$.type') as chunk_type,
          json_extract(chunk.value, '$.id') as chunk_id,
          json_array_length(json_extract(chunk.value, '$.vector')) as vector_length,
          CAST(json_extract(chunk.value, '$.vector[0]') AS REAL) as first_dim,
          CAST(json_extract(chunk.value, '$.vector[1]') AS REAL) as second_dim,
          -- Calculate vector magnitude (first 10 dimensions for performance)
          SQRT(
            CAST(json_extract(chunk.value, '$.vector[0]') AS REAL) * CAST(json_extract(chunk.value, '$.vector[0]') AS REAL) +
            CAST(json_extract(chunk.value, '$.vector[1]') AS REAL) * CAST(json_extract(chunk.value, '$.vector[1]') AS REAL) +
            CAST(json_extract(chunk.value, '$.vector[2]') AS REAL) * CAST(json_extract(chunk.value, '$.vector[2]') AS REAL) +
            CAST(json_extract(chunk.value, '$.vector[3]') AS REAL) * CAST(json_extract(chunk.value, '$.vector[3]') AS REAL) +
            CAST(json_extract(chunk.value, '$.vector[4]') AS REAL) * CAST(json_extract(chunk.value, '$.vector[4]') AS REAL)
          ) as magnitude_sample
        FROM _content_blog, json_each(embeddings) chunk
        WHERE embeddings IS NOT NULL
      )
      SELECT 
        chunk_type,
        COUNT(*) as total_chunks,
        AVG(vector_length) as avg_vector_length,
        AVG(first_dim) as avg_first_dim,
        AVG(second_dim) as avg_second_dim,
        AVG(magnitude_sample) as avg_magnitude,
        MIN(magnitude_sample) as min_magnitude,
        MAX(magnitude_sample) as max_magnitude
      FROM vector_stats
      GROUP BY chunk_type
      ORDER BY total_chunks DESC;` 
    },
    
    { 
      name: '🔎 Search Similar Content by Keyword', 
      sql: `-- Replace 'javascript' with your search term
      WITH target_chunks AS (
        SELECT 
          title,
          json_extract(chunk.value, '$.type') as chunk_type,
          json_extract(chunk.value, '$.text') as chunk_text,
          json_extract(chunk.value, '$.vector') as chunk_vector,
          json_extract(chunk.value, '$.id') as chunk_id
        FROM _content_blog, json_each(embeddings) chunk
        WHERE embeddings IS NOT NULL
          AND LOWER(json_extract(chunk.value, '$.text')) LIKE '%javascript%'
      ),
      all_chunks AS (
        SELECT 
          title,
          json_extract(chunk.value, '$.type') as chunk_type,
          json_extract(chunk.value, '$.text') as chunk_text,
          json_extract(chunk.value, '$.vector') as chunk_vector,
          json_extract(chunk.value, '$.id') as chunk_id
        FROM _content_blog, json_each(embeddings) chunk
        WHERE embeddings IS NOT NULL
      )
      SELECT 
        t.title as "Target Post",
        t.chunk_type as "Target Type",
        substr(t.chunk_text, 1, 60) || '...' as "Target Text",
        a.title as "Similar Post",
        a.chunk_type as "Similar Type",
        substr(a.chunk_text, 1, 60) || '...' as "Similar Text",
        ROUND(
          (
            CAST(json_extract(t.chunk_vector, '$[0]') AS REAL) * CAST(json_extract(a.chunk_vector, '$[0]') AS REAL) +
            CAST(json_extract(t.chunk_vector, '$[1]') AS REAL) * CAST(json_extract(a.chunk_vector, '$[1]') AS REAL) +
            CAST(json_extract(t.chunk_vector, '$[2]') AS REAL) * CAST(json_extract(a.chunk_vector, '$[2]') AS REAL)
          ), 4
        ) as similarity
      FROM target_chunks t
      CROSS JOIN all_chunks a
      WHERE t.chunk_id != a.chunk_id
        AND t.chunk_vector IS NOT NULL 
        AND a.chunk_vector IS NOT NULL
      ORDER BY similarity DESC
      LIMIT 15;` 
    },
    
    { 
      name: '🏷️ Heading Structure Analysis', 
      sql: `WITH headings AS (
        SELECT 
          title,
          path,
          json_extract(chunk.value, '$.type') as chunk_type,
          json_extract(chunk.value, '$.level') as heading_level,
          json_extract(chunk.value, '$.text') as heading_text
        FROM _content_blog, json_each(embeddings) chunk
        WHERE embeddings IS NOT NULL
          AND json_extract(chunk.value, '$.type') = 'heading'
      )
      SELECT 
        title,
        'H' || heading_level as level,
        heading_text as "Heading Text",
        length(heading_text) as char_count
      FROM headings
      ORDER BY title, CAST(heading_level AS INTEGER);` 
    },
    
    { 
      name: '⚠️ Embedding Debug Issues', 
      sql: `SELECT 
        title,
        path,
        CASE 
          WHEN embeddings IS NULL THEN '❌ No embeddings generated'
          WHEN json_array_length(embeddings) = 0 THEN '⚠️ Empty embeddings array'
          WHEN embeddingError IS NOT NULL THEN '💥 Error: ' || embeddingError
          ELSE '✅ OK (' || json_array_length(embeddings) || ' chunks)'
        END as status,
        CASE 
          WHEN embeddings IS NOT NULL THEN 
            (SELECT COUNT(*) FROM json_each(embeddings) 
             WHERE json_extract(value, '$.vector') IS NULL) 
          ELSE NULL 
        END as chunks_without_vectors,
        lastModified
      FROM _content_blog
      ORDER BY 
        CASE 
          WHEN embeddings IS NULL THEN 1
          WHEN embeddingError IS NOT NULL THEN 2
          WHEN json_array_length(embeddings) = 0 THEN 3
          ELSE 4
        END,
        lastModified DESC;` 
    },
    
    { 
      name: '🎨 Content Type Distribution', 
      sql: `WITH content_chunks AS (
        SELECT 
          json_extract(chunk.value, '$.type') as chunk_type,
          length(json_extract(chunk.value, '$.text')) as text_length,
          json_array_length(json_extract(chunk.value, '$.vector')) as vector_dim
        FROM _content_blog, json_each(embeddings) chunk
        WHERE embeddings IS NOT NULL
      )
      SELECT 
        chunk_type as "Content Type",
        COUNT(*) as "Total Chunks",
        ROUND(AVG(text_length), 1) as "Avg Text Length",
        ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM content_chunks), 1) as "Percentage %",
        MIN(vector_dim) as "Min Vector Dim",
        MAX(vector_dim) as "Max Vector Dim",
        CASE chunk_type
          WHEN 'heading' THEN '📝'
          WHEN 'paragraph' THEN '📄'
          WHEN 'code' THEN '💻'
          WHEN 'list' THEN '📋'
          WHEN 'quote' THEN '💬'
          ELSE '📦'
        END as icon
      FROM content_chunks
      GROUP BY chunk_type
      ORDER BY COUNT(*) DESC;` 
    }
  ]
}

const commonQueries = getCommonQueries()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-3 py-4 max-w-4xl">
      <!-- Compact Header -->
      <div class="mb-6 text-center">
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

      <!-- Quick Queries Dropdown -->
      <div class="mb-4">
        <div class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Quick Queries
            </h3>
          </div>
          
          <div class="p-4">
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
      </div>

      <!-- SQL Query Input -->
      <div class="mb-4">
        <div class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              SQL Query
            </h2>
          </div>
          
          <div class="p-4">
            <div class="relative mb-4">
              <SqlEditor
                v-model="sqlQuery"
                :rows="6"
                placeholder="SELECT title, path, date FROM _content_blog LIMIT 5;"
                class="w-full"
                @execute="executeQuery"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-400 dark:text-gray-500">
                Columns: id, title, path, date, description, tags, wordCount, readingTime
              </div>
              
              <div class="flex items-center gap-3">
                <div class="hidden md:block text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                  <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono">Tab</kbd> indent • 
                  <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono">⌘+Enter</kbd> execute
                </div>
                
                <button
                  :disabled="loading || !sqlQuery.trim()"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                  @click="executeQuery"
                >
                  <span v-if="!loading" class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                    </svg>
                    Execute Query
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                    </svg>
                    Executing...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="error || results">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 animate-fade-in mb-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Error</h3>
              <pre class="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap font-mono bg-red-100 dark:bg-red-900/30 p-3 rounded overflow-x-auto">{{ error }}</pre>
            </div>
          </div>
        </div>

        <div v-if="results" class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div class="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-300 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Query Results
              </span>
              <span class="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-sm">
                {{ results.length }} {{ results.length === 1 ? 'row' : 'rows' }}
              </span>
            </h3>
          </div>
          
          <div class="p-0">
            <div v-if="results.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"/>
              </svg>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">No Results</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Query executed successfully</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      v-for="header in Object.keys(results[0] || {})"
                      :key="header"
                      scope="col"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
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
                      class="px-3 py-2 text-gray-900 dark:text-gray-100"
                    >
                      <pre class="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 max-w-xs overflow-hidden">{{ formatValue(value) }}</pre>
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

