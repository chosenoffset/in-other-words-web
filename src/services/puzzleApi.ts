import axios from 'axios'
import type { Puzzle, PuzzleSubmission, PuzzleResult, AttemptStatus } from '../types/puzzle'

export async function getTodaysPuzzle(): Promise<Puzzle> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day`
    )
    const puzzle = response.data.data
    
    // Store fingerprint for anonymous users
    if (puzzle.userFingerprint) {
      localStorage.setItem('puzzleFingerprint', puzzle.userFingerprint)
    }
    
    return puzzle
  } catch (error) {
    console.error('Failed to fetch puzzle of the day:', error)
    throw new Error("Failed to load today's puzzle")
  }
}

export async function getAttemptStatus(puzzleId: string): Promise<AttemptStatus> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/public/puzzle-of-the-day/attempts/${puzzleId}`
    )
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch attempt status:', error)
    throw new Error('Failed to load attempt status')
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
      remainingGuesses,
      maxGuesses,
    } = response.data.data

    return {
      isCorrect,
      message: isCorrect
        ? 'Correct! Well done!'
        : remainingGuesses === 0
        ? 'No more guesses remaining. Try again tomorrow!'
        : 'Not quite right. Try again!',
      puzzleId: returnedPuzzleId,
      submittedAnswer,
      remainingGuesses,
      maxGuesses,
    }
  } catch (error) {
    console.error('Failed to submit answer:', error)
    
    // Handle rate limiting
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      return {
        isCorrect: false,
        message: 'Too many attempts. Please wait a moment before trying again.',
      }
    }
    
    return {
      isCorrect: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}

export async function convertAnonymousAttempts(token: string): Promise<void> {
  const fingerprint = localStorage.getItem('puzzleFingerprint')
  if (!fingerprint) {
    return
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/app/attempts/convert-attempts`,
      { userFingerprint: fingerprint },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    
    // Clear fingerprint after successful conversion
    localStorage.removeItem('puzzleFingerprint')
  } catch (error) {
    console.error('Failed to convert anonymous attempts:', error)
    // Don't throw - this is not critical to user experience
  }
}
