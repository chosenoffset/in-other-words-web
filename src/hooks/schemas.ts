import { z } from 'zod'

// Stripe subscription enums
export const subscriptionStatusEnum = z.enum([
  'ACTIVE',
  'CANCELED',
  'INCOMPLETE',
  'INCOMPLETE_EXPIRED',
  'PAST_DUE',
  'PAUSED',
  'TRIALING',
  'UNPAID',
])

export type SubscriptionStatus = z.infer<typeof subscriptionStatusEnum>

export const billingIntervalEnum = z.enum(['MONTHLY', 'YEARLY'])

export type BillingInterval = z.infer<typeof billingIntervalEnum>

// Transaction enums
export const transactionStatusEnum = z.enum(['PENDING', 'COMPLETED', 'FAILED'])

export type TransactionStatus = z.infer<typeof transactionStatusEnum>

export const transactionTypeEnum = z.enum(['SUBSCRIPTION'])

export type TransactionType = z.infer<typeof transactionTypeEnum>

// Transaction schema (relation objects omitted to avoid circular refs)
export const transactionSchema = z.object({
  id: z.string(),
  checkoutSessionId: z.string().nullable().optional(),
  userId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: transactionStatusEnum,
  type: transactionTypeEnum,
  subscriptionId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Transaction = z.infer<typeof transactionSchema>

// StripeSubscription schema (relation objects omitted)
export const stripeSubscriptionSchema = z.object({
  id: z.string(),
  stripeSubscriptionId: z.string().nullable().optional(),
  stripeSubscriptionItemId: z.string().nullable().optional(),
  status: subscriptionStatusEnum,
  billingInterval: billingIntervalEnum,
  quantity: z.number(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type StripeSubscription = z.infer<typeof stripeSubscriptionSchema>

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']),
  stripeCustomerId: z.string().nullable().optional(),
  stripeSubscription: stripeSubscriptionSchema.nullable().optional(),
  stripeSubscriptions: z.array(stripeSubscriptionSchema).optional(),
  transactions: z.array(transactionSchema).optional().default([]),
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
  category: z.enum([
    'MUSIC',
    'MOVIES_TV',
    'GAMES',
    'SPORTS',
    'BOOKS',
    'UNCATEGORIZED',
  ]),
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
  num_hints: z.number().optional(),
  category: z.enum([
    'MUSIC',
    'MOVIES_TV',
    'GAMES',
    'SPORTS',
    'BOOKS',
    'UNCATEGORIZED',
  ]),
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
  currentStreak: z.number().nullable().optional(),
  longestStreak: z.number().nullable().optional(),
  averageGuesses: z.number().nullable().optional(),
  averageSolveTimeMs: z.number().nullable().optional(),
  fastestSolveMs: z.number().nullable().optional(),
  lastPlayedAt: z.string().nullable().optional(),
})

export type PlayerStats = z.infer<typeof playerStatsSchema>

export const giveUpResponseSchema = z.object({
  success: z.boolean(),
  puzzleId: z.string(),
  gaveUp: z.boolean(),
  message: z.string(),
})

export type GiveUpResponse = z.infer<typeof giveUpResponseSchema>
