import { z } from 'zod'

export const blogSchema = z.object({
  tags: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  // Custom computed columns added by hooks
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
  lastModified: z.date().optional(),
  embedding: z.array(z.number()).nullable().optional(), // Add this line
  embeddingError: z.string().optional() // Optional: to log errors
})

export type BlogPost = z.infer<typeof blogSchema>