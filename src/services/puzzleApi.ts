import axios from 'axios'
import type { Puzzle, PuzzleSubmission, PuzzleResult } from '../types/puzzle'

export async function getTodaysPuzzle(): Promise<Puzzle> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day`
    )
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch puzzle of the day:', error)
    throw new Error("Failed to load today's puzzle")
  }
}

export async function submitAnswer(
  submission: PuzzleSubmission
): Promise<PuzzleResult> {
  try {
    const { userAnswer, puzzleId } = submission

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day/submit/${puzzleId}`,
      { answer: userAnswer }
    )

    console.log("Response:", response.data)

    const {
      isCorrect,
      puzzleId: returnedPuzzleId,
      submittedAnswer,
    } = response.data.data

    return {
      isCorrect,
      message: isCorrect
        ? 'Correct! Well done!'
        : 'Not quite right. Try again!',
      puzzleId: returnedPuzzleId,
      submittedAnswer,
    }
  } catch (error) {
    console.error('Failed to submit answer:', error)
    return {
      isCorrect: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}
