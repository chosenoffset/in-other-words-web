import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import { GuessHistoryList } from '@/components/GuessHistoryList.tsx'
import '../styles.css'
import { useGameContext } from '@/hooks/useGameContext'
import { useGuessHistory } from '@/hooks/useGuessHistory'
import { Spinner } from '../components/Spinner'
import { useState, useEffect, useRef } from 'react'
import { Container } from '@/components/ui'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const {
    currentPuzzle: puzzle,
    puzzleLoading,
    attemptLoading,
  } = useGameContext()
  const { guesses, addGuess, revealHintForGuess } = useGuessHistory(puzzle?.id)
  const [isVisible, setIsVisible] = useState({ header: false, card: false })
  const headerRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll-based animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px',
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.current) {
            setIsVisible(prev => ({ ...prev, header: true }))
          } else if (entry.target === cardRef.current) {
            setIsVisible(prev => ({ ...prev, card: true }))
          }
        }
      })
    }, observerOptions)

    if (headerRef.current) observer.observe(headerRef.current)
    if (cardRef.current) observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [puzzle])

  return (
    <main className='min-h-screen bg-gradient-game'>
      <Container
        size='lg'
        className='xl:max-w-screen-xl 2xl:max-w-screen-2xl'
        background='subtle'
        padding='sm'
      >
        {(puzzleLoading || attemptLoading) && (
          <div className='flex justify-center animate-fade-in py-12'>
            <Spinner aria-label='Loading puzzle' />
          </div>
        )}

        {puzzle && (
          <div
            ref={cardRef}
            className={`w-full transition-all duration-600 transform ${
              isVisible.card
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-98'
            }`}
            aria-label='Game area'
          >
            <div className='p-4 max-w-2xl mx-auto space-y-4'>
              <PuzzleOfTheDay puzzle={puzzle} />
              <AnswerSubmission onGuessSubmitted={addGuess} />
              <GuessHistoryList
                puzzle={puzzle}
                guesses={guesses}
                onRevealHint={revealHintForGuess}
              />
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}
