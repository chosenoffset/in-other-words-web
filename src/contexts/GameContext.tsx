import { useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  useGetPuzzleOfTheDay,
  useGetAttemptStatus,
  useSubmitAnswer,
} from '@/hooks/usePuzzles'
import type { SubmitAnswerResponse } from '@/hooks/schemas'
import { GameContext, type GameContextValue } from './GameContextDefinition'

interface GameContextProviderProps {
  children: ReactNode
}

export function GameContextProvider({ children }: GameContextProviderProps) {
  const { data: currentPuzzle, isLoading: puzzleLoading } =
    useGetPuzzleOfTheDay()
  const {
    data: attemptStatus,
    isLoading: attemptLoading,
    refetch: refetchAttemptStatus,
  } = useGetAttemptStatus(currentPuzzle?.id)
  const submitAnswerMutation = useSubmitAnswer()

  // Calculate if user is out of guesses (existing logic)
  const isOutOfGuesses = Boolean(attemptStatus?.remainingGuesses === 0)

  const submitAnswer = useCallback(
    async (answer: string): Promise<SubmitAnswerResponse['data']> => {
      if (!currentPuzzle?.id) {
        throw new Error('No puzzle available for submission')
      }

      try {
        const result = await submitAnswerMutation.mutateAsync({
          puzzleId: currentPuzzle.id,
          userAnswer: answer,
          timestamp: new Date(),
        })

        // Refetch attempt status to update remaining guesses
        await refetchAttemptStatus()

        return result
      } catch (error) {
        console.error('Failed to submit answer:', error)
        throw error
      }
    },
    [currentPuzzle?.id, submitAnswerMutation, refetchAttemptStatus]
  )

  const value: GameContextValue = {
    currentPuzzle: currentPuzzle || null,
    attemptStatus: attemptStatus || null,
    submissionResult: null, // Will be set by components after submission
    isOutOfGuesses,
    submitAnswer,
    puzzleLoading,
    attemptLoading,
    submissionLoading: submitAnswerMutation.isPending,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
