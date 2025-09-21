import { createFileRoute } from '@tanstack/react-router'
import { PuzzleOfTheDay } from '@/components/PuzzleOfTheDay.tsx'
import { AnswerSubmission } from '@/components/AnswerSubmission.tsx'
import { HintsSection } from '@/components/HintsSection.tsx'
import '../styles.css'
import { useGetPuzzleOfTheDay, useGetAttemptStatus } from '@/hooks/usePuzzles'
import { Spinner } from '../components/Spinner'
import { useState, useEffect, useRef } from 'react'
import type { PuzzleResult } from '@/hooks/schemas'
import { Container, Card } from '@/components/ui'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const { data: puzzle, isLoading: puzzleLoading } = useGetPuzzleOfTheDay()
  const { data: attemptStatus, isLoading: attemptLoading } = useGetAttemptStatus(puzzle?.id)
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false)
  const [isVisible, setIsVisible] = useState({ header: false, card: false })
  const headerRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleSubmissionResult = (result: PuzzleResult) => {
    if (!result.isCorrect) {
      setHasIncorrectGuess(true)
    }
  }

  // Intersection Observer for scroll-based animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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
    <main className="min-h-screen bg-gradient-game">
      <Container background="subtle" padding="md">
        <header
          ref={headerRef}
          className={`text-center mb-7 transition-all duration-1000 transform ${
            isVisible.header
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3 transition-all duration-1000 delay-200 transform ${
            isVisible.header
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}>
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              In Other Words
            </span>
          </h1>
          <p className={`text-lg text-muted max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 transform ${
            isVisible.header
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}>
            A daily twist on wordplay. Decode a clue to find the phrase it points to.
          </p>
        </header>

        {(puzzleLoading || attemptLoading) && (
          <div className="flex justify-center animate-fade-in">
            <Spinner aria-label='Loading puzzle' />
          </div>
        )}

        {puzzle && (
          <Card
            ref={cardRef}
            variant="game"
            className={`min-h-[260px] grid place-items-center shadow-xl transition-all duration-1000 transform ${
              isVisible.card
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-95'
            }`}
            aria-label='Game area'
          >
            <div className="text-center p-10 flex gap-10 items-start justify-center flex-wrap md:flex-nowrap">
              <div className={`flex-1 max-w-[600px] flex flex-col gap-6 transition-all duration-1000 delay-300 transform ${
                isVisible.card
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-8'
              }`}>
                <PuzzleOfTheDay puzzle={puzzle} />
                <AnswerSubmission
                  puzzle={puzzle}
                  initialAttemptStatus={attemptStatus}
                  onSubmissionResult={handleSubmissionResult}
                />
              </div>
              <div className={`w-full md:w-[300px] md:flex-shrink-0 transition-all duration-1000 delay-600 transform ${
                isVisible.card
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'
              }`}>
                <HintsSection puzzle={puzzle} hasIncorrectGuess={hasIncorrectGuess} />
              </div>
            </div>
          </Card>
        )}
      </Container>
    </main>
  )
}
