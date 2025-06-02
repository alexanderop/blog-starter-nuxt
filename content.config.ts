import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema:  z.object({
        tags: z.array(z.string()),
        title: z.string(),
        description: z.string(),
        date: z.string(),
        // Custom computed columns added by hooks
        readingTime: z.number().optional(),
        wordCount: z.number().optional(),
        lastModified: z.date().optional(),
        embedding: z.array(z.number()).optional(),
        embeddingError: z.string().optional(),
      }) 
    })
  }
})