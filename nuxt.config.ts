// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  imports: {
    dirs: [
      'config/**'
    ]
  },
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

      if (file.id.endsWith('.md')) {
        const wordsPerMinute = 180
        const text = typeof file.body === 'string' ? file.body : ''
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
        content.readingTime = Math.ceil(wordCount / wordsPerMinute)
        content.wordCount = wordCount
        content.lastModified = new Date()
      }
    }
  }
})