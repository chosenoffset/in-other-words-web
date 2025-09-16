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
  hints: z.array(z.string()).default([]),
  category: z.enum(['MUSIC', 'MOVIES_TV', 'GAMES', 'SPORTS', 'BOOKS', 'UNCATEGORIZED']),
  displayDate: z.string().nullable().optional(),
  displayOrder: z.number().optional(),

  published: z.boolean(),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Puzzle = z.infer<typeof puzzleSchema>

export const puzzleQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  hints: z.array(z.string()).optional(),
  category: z.enum(['MUSIC', 'MOVIES_TV', 'GAMES', 'SPORTS', 'BOOKS', 'UNCATEGORIZED']),
})

export type PuzzleQuestion = z.infer<typeof puzzleQuestionSchema>

export const puzzleSubmissionSchema = z.object({
  puzzleId: z.string(),
  userAnswer: z.string(),
  timestamp: z.date(),
})

export type PuzzleSubmission = z.infer<typeof puzzleSubmissionSchema>

export const puzzleResultSchema = z.object({
  isCorrect: z.boolean(),
  message: z.string(),
  hint: z.string().optional(),
  puzzleId: z.string().optional(),
  submittedAnswer: z.string().optional(),
  remainingGuesses: z.number().optional(),
  maxGuesses: z.number().optional(),
})

export type PuzzleResult = z.infer<typeof puzzleResultSchema>

export const attemptStatusSchema = z.object({
  attemptCount: z.number(),
  remainingGuesses: z.number(),
  maxGuesses: z.number(),
})

export type AttemptStatus = z.infer<typeof attemptStatusSchema>

// Raw API response for submitAnswer; UI derives messages from this shape
export const submitAnswerResponseSchema = z.object({
  data: z.object({
    isCorrect: z.boolean(),
    puzzleId: z.string().optional(),
    submittedAnswer: z.string().optional(),
    hint: z.string().optional(),
    remainingGuesses: z.number().optional(),
    maxGuesses: z.number().optional(),
  }),
})

export type SubmitAnswerResponse = z.infer<typeof submitAnswerResponseSchema>

export const playerStatsSchema = z.object({
  totalGames: z.number(),
  gamesWon: z.number(),
  winRate: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  averageGuesses: z.number(),
  averageSolveTimeMs: z.number(),
  fastestSolveMs: z.number(),
  lastPlayedAt: z.string().nullable(),
})

export type PlayerStats = z.infer<typeof playerStatsSchema>

export const giveUpResponseSchema = z.object({
  success: z.boolean(),
  puzzleId: z.string(),
  gaveUp: z.boolean(),
  message: z.string(),
})

export type GiveUpResponse = z.infer<typeof giveUpResponseSchema>
