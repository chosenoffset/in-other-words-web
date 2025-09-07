import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type User = z.infer<typeof userSchema>

export const puzzleSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  hint: z.string(),

  published: z.boolean(),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Puzzle = z.infer<typeof puzzleSchema>
