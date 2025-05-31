import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        tags: z.array(z.string()),
        title: z.string(),
        description: z.string(),
        date: z.date(),
        // Custom computed columns added by hooks
        readingTime: z.number().optional(),
        wordCount: z.number().optional(),
        excerpt: z.string().optional(),
        lastModified: z.date().optional(),
        contentType: z.enum(['tutorial', 'guide', 'article']).optional(),
      })
    })
  }
})