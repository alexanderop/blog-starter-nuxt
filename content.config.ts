import { defineContentConfig, defineCollection } from '@nuxt/content'
import { blogSchema } from './schema/blog'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: blogSchema
    })
  }
})