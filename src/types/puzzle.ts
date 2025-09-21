export interface Puzzle {
  id: string
  question: string
  hints?: []
  category:
    | 'MUSIC'
    | 'MOVIES_TV'
    | 'GAMES'
    | 'SPORTS'
    | 'BOOKS'
    | 'UNCATEGORIZED'
  userFingerprint?: string
}

export interface PuzzleSubmission {
  puzzleId: string
  userAnswer: string
  timestamp: Date
}

export interface PuzzleResult {
  isCorrect: boolean
  message: string
  hint?: string
  puzzleId?: string
  submittedAnswer?: string
  remainingGuesses?: number
  maxGuesses?: number
}

export interface AttemptStatus {
  attemptCount: number
  remainingGuesses: number
  maxGuesses: number
}

export interface GameState {
  currentPuzzle: Puzzle | null
  isLoading: boolean
  error: string | null
  userAnswer: string
  submissionResult: PuzzleResult | null
  isSubmitting: boolean
}
