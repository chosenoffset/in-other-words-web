import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import '../styles.css'
import { useGetPuzzleOfTheDay } from '@/hooks/usePuzzles'
import { Spinner } from '../components/Spinner'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
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
            <AnswerSubmission puzzle={puzzle} />
          </div>
        </section>
      )}
    </>
  )
}
