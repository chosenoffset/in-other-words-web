import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import {
  puzzleQuestionSchema,
  puzzleSchema,
  submitAnswerResponseSchema,
  playerStatsSchema,
  type SubmitAnswerResponse,
  type PuzzleSubmission,
  type GiveUpResponse,
} from '@/hooks/schemas'

export const useGetPublishedPuzzles = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['puzzles'],
    queryFn: async () => {
      try {
        const token = await getToken()
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/app/puzzles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        return z.array(puzzleSchema).parse(response.data)
      } catch (error) {
        console.error('Failed to get published puzzles:', error)
        return []
      }
    },
  })
}

export const useGetPuzzleOfTheDay = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['puzzleOfTheDay'],
    queryFn: async () => {
      try {
        const token = await getToken()
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        return puzzleQuestionSchema.parse(response.data)
      } catch (error) {
        console.error('Failed to get puzzle of the day:', error)
        return null
      }
    },
  })
}

export const useGetAttemptStatus = (puzzleId: string | undefined) => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['attemptStatus', puzzleId],
    queryFn: async () => {
      if (!puzzleId) return null
      try {
        const token = await getToken()
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day/attempts/${puzzleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        return response.data.data
      } catch (error) {
        console.error('Failed to get attempt status:', error)
        return null
      }
    },
    enabled: !!puzzleId,
  })
}

export const useSubmitAnswer = () => {
  const { getToken } = useAuth()
  return useMutation<SubmitAnswerResponse['data'], Error, PuzzleSubmission>({
    mutationKey: ['submitAnswer'],
    mutationFn: async (submission: PuzzleSubmission) => {
      const token = await getToken()
      const { userAnswer, puzzleId } = submission
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day/submit/${puzzleId}`,
          {
            answer: userAnswer,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const parsed = submitAnswerResponseSchema.parse(response.data)
        return parsed.data
      } catch (error) {
        console.error('Failed to submit answer:', error)
        throw error as Error
      }
    },
  })
}

export const useGetPlayerStats = () => {
  const { getToken, isSignedIn } = useAuth()
  return useQuery({
    queryKey: ['playerStats'],
    queryFn: async () => {
      try {
        const token = await getToken()
        if (!token) return null

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/app/stats/player`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        return playerStatsSchema.parse(response.data.data)
      } catch (error) {
        console.error('Failed to get player stats:', error)
        return null
      }
    },
    enabled: isSignedIn,
  })
}

export const useGiveUpPuzzle = () => {
  const { getToken } = useAuth()
  return useMutation<GiveUpResponse, Error, string>({
    mutationKey: ['giveUpPuzzle'],
    mutationFn: async (puzzleId: string) => {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day/give-up/${puzzleId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        return response.data.data
      } catch (error) {
        console.error('Failed to give up puzzle:', error)
        throw error as Error
      }
    },
  })
}
