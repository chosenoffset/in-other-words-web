import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import '../styles.css'
import { getTodaysPuzzle } from '@/services/puzzleApi.ts'

export const Route = createFileRoute('/')({
  loader: async () => {
    return await getTodaysPuzzle()
  },
  component: Landing,
})

function Landing() {
  const puzzle = Route.useLoaderData()
  return (
    <main className='container'>
      <header className='hero'>
        <h1 className='title'>In Other Words</h1>
        <p className='subtitle'>
          A daily twist on wordplay. Decode a clue to find the phrase it points
          to.
        </p>
      </header>

      <section className='shell' aria-label='Game area placeholder'>
        <div className='shell-inner'>
          <PuzzleOfTheDay puzzle={puzzle} />
          <AnswerSubmission puzzle={puzzle} />
        </div>
      </section>
    </main>
  )
}
