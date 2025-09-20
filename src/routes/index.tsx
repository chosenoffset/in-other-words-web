import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import { HintsSection } from '@/components/HintsSection.tsx'
import '../styles.css'
import { useGetPuzzleOfTheDay, useGetAttemptStatus } from '@/hooks/usePuzzles'
import { Spinner } from '../components/Spinner'
import { useState } from 'react'
import type { PuzzleResult } from '@/hooks/schemas'
import { Container, Card } from '@/components/ui'

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
    <main>
      <Container className="py-14">
        <header className="text-center mb-7">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            In Other Words
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            A daily twist on wordplay. Decode a clue to find the phrase it points
            to.
          </p>
        </header>

        {(puzzleLoading || attemptLoading) && (
          <div className="flex justify-center">
            <Spinner aria-label='Loading puzzle' />
          </div>
        )}

        {puzzle && (
          <Card className="min-h-[260px] grid place-items-center shadow-sm" aria-label='Game area'>
            <div className="text-center p-10 flex gap-10 items-start justify-center flex-wrap md:flex-nowrap">
              <div className="flex-1 max-w-[600px] flex flex-col gap-6">
                <PuzzleOfTheDay puzzle={puzzle} />
                <AnswerSubmission
                  puzzle={puzzle}
                  initialAttemptStatus={attemptStatus}
                  onSubmissionResult={handleSubmissionResult}
                />
              </div>
              <div className="w-full md:w-[300px] md:flex-shrink-0">
                <HintsSection puzzle={puzzle} hasIncorrectGuess={hasIncorrectGuess} />
              </div>
            </div>
          </Card>
        )}
      </Container>
    </main>
  )
}
