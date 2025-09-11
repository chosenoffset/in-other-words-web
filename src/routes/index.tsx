import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import '../styles.css'
import { useGetPuzzleOfTheDay } from '@/hooks/usePuzzles'
import { Spinner } from '../components/Spinner'
import { getAttemptStatus } from '@/services/puzzleApi.ts'

export const Route = createFileRoute('/')({
  loader: async () => {
    const puzzle = await getTodaysPuzzle()
    let attemptStatus = null

    try {
      attemptStatus = await getAttemptStatus(puzzle.id)
    } catch (error) {
      // If attempt status fails, continue without it
      console.warn('Could not fetch attempt status:', error)
    }

    return { puzzle, attemptStatus }
  },
  component: Landing,
})

function Landing() {
  const { puzzle, attemptStatus } = Route.useLoaderData()
  return (
    <main className='container'>
      <header className='hero'>
        <h1 className='title'>In Other Words</h1>
        <p className='subtitle'>
          A daily twist on wordplay. Decode a clue to find the phrase it points
          to.
        </p>
      </header>

      <LandingClient />
    </main>
  )
}

function LandingClient() {
  const { data: puzzle, isLoading } = useGetPuzzleOfTheDay()

  return (
    <>
      {isLoading && <Spinner aria-label='Loading puzzle' />}
      {puzzle && (
        <section className='shell' aria-label='Game area placeholder'>
          <div className='shell-inner'>
            <PuzzleOfTheDay puzzle={puzzle} />
            <AnswerSubmission puzzle={puzzle} initialAttemptStatus={attemptStatus} />
          </div>
        </section>
      )}
    </>
  )
}
