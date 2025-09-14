import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import { HintsSection } from '@/components/HintsSection.tsx'
import '../styles.css'
import { useGetPuzzleOfTheDay, useGetAttemptStatus } from '@/hooks/usePuzzles'
import { Spinner } from '../components/Spinner'
import { useState } from 'react'
import type { PuzzleResult } from '@/hooks/schemas'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const { data: puzzle, isLoading: puzzleLoading } = useGetPuzzleOfTheDay()
  const { data: attemptStatus, isLoading: attemptLoading } = useGetAttemptStatus(puzzle?.id)
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false)

  const handleSubmissionResult = (result: PuzzleResult) => {
    if (!result.isCorrect) {
      setHasIncorrectGuess(true)
    }
  }

  return (
    <main className='container'>
      <header className='hero'>
        <h1 className='title'>In Other Words</h1>
        <p className='subtitle'>
          A daily twist on wordplay. Decode a clue to find the phrase it points
          to.
        </p>
      </header>

      {(puzzleLoading || attemptLoading) && <Spinner aria-label='Loading puzzle' />}
      {puzzle && (
        <section className='shell' aria-label='Game area placeholder'>
          <div className='shell-inner'>
            <div className='puzzle-main-area'>
              <PuzzleOfTheDay puzzle={puzzle} />
              <AnswerSubmission
                puzzle={puzzle}
                initialAttemptStatus={attemptStatus}
                onSubmissionResult={handleSubmissionResult}
              />
            </div>
            <div className='puzzle-sidebar'>
              <HintsSection puzzle={puzzle} hasIncorrectGuess={hasIncorrectGuess} />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
