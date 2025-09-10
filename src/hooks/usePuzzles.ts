import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import {
  puzzleQuestionSchema,
  puzzleSchema,
  submitAnswerResponseSchema,
  type SubmitAnswerResponse,
  type PuzzleSubmission,
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
  return useQuery({
    queryKey: ['puzzleOfTheDay'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day`
        )
        return puzzleQuestionSchema.parse(response.data)
      } catch (error) {
        console.error('Failed to get puzzle of the day:', error)
        return null
      }
    },
  })
}

export const useSubmitAnswer = () => {
  return useMutation<SubmitAnswerResponse['data'], Error, PuzzleSubmission>({
    mutationKey: ['submitAnswer'],
    mutationFn: async (submission: PuzzleSubmission) => {
      const { userAnswer, puzzleId } = submission
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day/submit/${puzzleId}`,
          { answer: userAnswer }
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
