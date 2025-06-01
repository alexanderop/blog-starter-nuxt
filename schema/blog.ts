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
})

export type BlogPost = z.infer<typeof blogSchema>