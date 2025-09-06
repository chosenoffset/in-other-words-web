import type { Puzzle, PuzzleSubmission, PuzzleResult } from '../types/puzzle'

const HARDCODED_PUZZLE: Puzzle = {
  id: '1',
  date: '2024-01-01',
  question: 'Oysters sole possession, sandwich spread',
  answer: 'Pearl Jam',
  hint: 'Named after a basketball player',
  published: true,
  archived: false,
  createdAt: '',
  updatedAt: '',
}

export async function getTodaysPuzzle(): Promise<Puzzle> {
  console.log('Return hardcoded puzzle')
  // Return hardcoded puzzle for now
  return HARDCODED_PUZZLE
}

export async function submitAnswer(
  submission: PuzzleSubmission
): Promise<PuzzleResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const { userAnswer, puzzleId } = submission
  const puzzle = HARDCODED_PUZZLE

  if (puzzleId !== puzzle.id) {
    return {
      isCorrect: false,
      message: 'Puzzle not found',
    }
  }

  const normalizedUserAnswer = userAnswer.toLowerCase().trim()
  const normalizedCorrectAnswer = puzzle.answer.toLowerCase().trim()

  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return {
      isCorrect: true,
      message: 'Correct! Well done!',
    }
  }

  // Check if answer is close (for partial credit or hints)
  const answerWords = normalizedCorrectAnswer.split(' ')
  const userWords = normalizedUserAnswer.split(' ')
  const hasPartialMatch = answerWords.some(word =>
    userWords.some(
      userWord => word.includes(userWord) || userWord.includes(word)
    )
  )

  if (hasPartialMatch) {
    return {
      isCorrect: false,
      message:
        "You're on the right track! Try thinking about the specific phrase.",
      hint: puzzle.hint, // Give first hint
    }
  }

  return {
    isCorrect: false,
    message: 'Not quite right. Think about the clue more carefully.',
    hint: puzzle.hint, // Give first two hints
  }
}
