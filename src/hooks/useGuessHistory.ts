import { useState, useEffect } from 'react'

export interface GuessHistoryItem {
  id: string
  guessText: string
  isCorrect: boolean
  timestamp: string
  revealedHintIndices: number[]
}

interface GuessHistoryData {
  puzzleId: string
  guesses: GuessHistoryItem[]
}

const STORAGE_KEY = 'puzzle-guess-history'

export function useGuessHistory(puzzleId: string | undefined) {
  const [guesses, setGuesses] = useState<GuessHistoryItem[]>([])

  // Load guesses from localStorage when puzzleId changes
  useEffect(() => {
    if (!puzzleId) {
      setGuesses([])
      return
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data: GuessHistoryData = JSON.parse(stored)
        // Only load if it's for the current puzzle
        if (data.puzzleId === puzzleId) {
          setGuesses(data.guesses)
        } else {
          // New puzzle, clear old data
          setGuesses([])
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error('Failed to parse guess history:', error)
        setGuesses([])
      }
    }
  }, [puzzleId])

  // Save to localStorage whenever guesses change
  useEffect(() => {
    if (!puzzleId || guesses.length === 0) return

    const data: GuessHistoryData = {
      puzzleId,
      guesses,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [puzzleId, guesses])

  const addGuess = (guessText: string, isCorrect: boolean) => {
    const newGuess: GuessHistoryItem = {
      id: crypto.randomUUID(),
      guessText,
      isCorrect,
      timestamp: new Date().toISOString(),
      revealedHintIndices: [],
    }
    setGuesses(prev => [...prev, newGuess])
  }

  const revealHintForGuess = (guessId: string, hintIndex: number) => {
    setGuesses(prev =>
      prev.map(guess =>
        guess.id === guessId
          ? {
              ...guess,
              revealedHintIndices: [...guess.revealedHintIndices, hintIndex],
            }
          : guess
      )
    )
  }

  const clearHistory = () => {
    setGuesses([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    guesses,
    addGuess,
    revealHintForGuess,
    clearHistory,
  }
}
