// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/tailwindcss'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'dracula'
        }
      }
    }
  },
  hooks: {
    'content:file:afterParse'(ctx) {
      const { file, content } = ctx

      // Only process markdown files
      if (file.id.endsWith('.md')) {
        // Add reading time calculation
        const wordsPerMinute = 180
        const text = typeof file.body === 'string' ? file.body : ''
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
        content.readingTime = Math.ceil(wordCount / wordsPerMinute)
        content.wordCount = wordCount

        // Add excerpt if not provided in frontmatter
        if (!content.excerpt && text) {
          const cleanText = text.replace(/[#*`]/g, '').trim()
          content.excerpt = cleanText.length > 160 
            ? cleanText.substring(0, 160) + '...' 
            : cleanText
        }

        // Add last modified timestamp
        content.lastModified = new Date()

        // Add content type classification
        if (Array.isArray(content.tags) && content.tags.includes('tutorial')) {
          content.contentType = 'tutorial'
        } else if (Array.isArray(content.tags) && content.tags.includes('guide')) {
          content.contentType = 'guide'
        } else {
          content.contentType = 'article'
        }
      }
    }
  }
})