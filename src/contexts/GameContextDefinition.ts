import { createContext } from 'react'
import type {
  PuzzleQuestion,
  AttemptStatus,
  SubmitAnswerResponse,
} from '@/hooks/schemas'

export interface GameContextValue {
  // Current Game State (from existing hooks)
  currentPuzzle: PuzzleQuestion | null
  attemptStatus: AttemptStatus | null

  // Submission State
  submissionResult: null

  // Game Status Calculations (existing logic)
  isOutOfGuesses: boolean

  // Actions (existing functionality)
  submitAnswer: (answer: string) => Promise<SubmitAnswerResponse['data']>

  // Loading States
  puzzleLoading: boolean
  attemptLoading: boolean
  submissionLoading: boolean
}

export const GameContext = createContext<GameContextValue | null>(null)
