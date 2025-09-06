export interface Puzzle {
  id: string
  date: string
  question: string
  answer: string
  category?: string
  hint?: string
  published: true
  archived: false
  createdAt: ''
  updatedAt: ''
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
}

export interface GameState {
  currentPuzzle: Puzzle | null
  isLoading: boolean
  error: string | null
  userAnswer: string
  submissionResult: PuzzleResult | null
  isSubmitting: boolean
}
