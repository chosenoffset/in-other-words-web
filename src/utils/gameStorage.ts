interface PuzzleProgress {
  isCompleted: boolean
  attempts: number
  completedAt?: string
}

interface GameStorageData {
  puzzleProgress: Record<string, PuzzleProgress>
  lastPlayedDate?: string
}

const STORAGE_KEY = 'in-other-words-game-data'

export function getGameData(): GameStorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { puzzleProgress: {} }
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load game data from localStorage:', error)
    return { puzzleProgress: {} }
  }
}

export function saveGameData(data: GameStorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save game data to localStorage:', error)
  }
}

export function markPuzzleCompleted(puzzleId: string, attempts: number): void {
  const data = getGameData()
  data.puzzleProgress[puzzleId] = {
    isCompleted: true,
    attempts,
    completedAt: new Date().toISOString(),
  }
  data.lastPlayedDate = new Date().toISOString()
  saveGameData(data)
}

export function getPuzzleProgress(puzzleId: string): PuzzleProgress | null {
  const data = getGameData()
  return data.puzzleProgress[puzzleId] || null
}

export function isPuzzleCompleted(puzzleId: string): boolean {
  const progress = getPuzzleProgress(puzzleId)
  return progress?.isCompleted || false
}

export function updatePuzzleAttempts(puzzleId: string, attempts: number): void {
  const data = getGameData()
  const existing = data.puzzleProgress[puzzleId] || {
    isCompleted: false,
    attempts: 0,
  }
  data.puzzleProgress[puzzleId] = {
    ...existing,
    attempts,
  }
  data.lastPlayedDate = new Date().toISOString()
  saveGameData(data)
}
