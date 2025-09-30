import * as React from 'react'
import { useState } from 'react'
import type { PuzzleResult } from '@/hooks/schemas'
import { useGameContext } from '@/hooks/useGameContext'
import { useUserContext } from '@/hooks/useUserContext'
import { useUserSubscription } from '@/hooks/useUserSubscription'
import { GiveUpButton } from './GiveUpButton'
import { Button } from '@/components/ui'
import { SubscriptionCTA } from './SubscriptionCTA'
import { SignInCTA } from './SignInCTA'

interface AnswerSubmissionProps {
  onSubmissionResult?: (result: PuzzleResult) => void
}

export function AnswerSubmission({
  onSubmissionResult,
}: AnswerSubmissionProps) {
  // Get centralized state
  const {
    currentPuzzle: puzzle,
    attemptStatus,
    isOutOfGuesses,
    submitAnswer: submitGameAnswer,
    submissionLoading,
  } = useGameContext()
  const { isAuthenticated } = useUserContext()
  const { shouldShowSubscriptionCTA, shouldShowSignInCTA } =
    useUserSubscription()

  const [userAnswer, setUserAnswer] = useState('')
  const [submissionResult, setSubmissionResult] = useState<PuzzleResult | null>(
    null
  )
  const [showAnimation, setShowAnimation] = useState<
    'correct' | 'incorrect' | null
  >(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!puzzle || !userAnswer.trim() || submissionLoading) {
      return
    }

    // Check if user has remaining guesses
    if (attemptStatus && attemptStatus.remainingGuesses <= 0) {
      setSubmissionResult({
        isCorrect: false,
        message: 'No more guesses remaining. Try again tomorrow!',
      })
      return
    }

    try {
      const api = await submitGameAnswer(userAnswer.trim())

      const result: PuzzleResult = {
        isCorrect: api.isCorrect,
        message: api.isCorrect
          ? 'Correct! Well done!'
          : 'Not quite right. Try again!',
        puzzleId: api.puzzleId,
        submittedAnswer: api.submittedAnswer,
        hint: api.hint,
        remainingGuesses: api.remainingGuesses,
        maxGuesses: api.maxGuesses,
      }

      setSubmissionResult(result)
      onSubmissionResult?.(result)

      // Trigger animation based on result
      setShowAnimation(result.isCorrect ? 'correct' : 'incorrect')
      setTimeout(() => setShowAnimation(null), 1000)

      // Clear input if correct
      if (result.isCorrect) {
        setUserAnswer('')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      setSubmissionResult({
        isCorrect: false,
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value)
    // Clear previous result when user starts typing again
    if (submissionResult) {
      setSubmissionResult(null)
    }
  }

  const handleGiveUp = () => {
    // Mark as gave up with a special result
    const giveUpResult: PuzzleResult = {
      isCorrect: false,
      message: 'You gave up on this puzzle. The answer will be revealed.',
    }
    setSubmissionResult(giveUpResult)
    onSubmissionResult?.(giveUpResult)
  }

  if (!puzzle) {
    return (
      <div className='space-y-6 animate-fade-in'>
        {/* Enhanced skeleton loading */}
        <div className='space-y-4'>
          <div className='h-4 w-20 bg-muted rounded skeleton-loading'></div>
          <div className='flex gap-3'>
            <div className='flex-1 h-12 bg-muted rounded-lg skeleton-loading'></div>
            <div className='w-24 h-12 bg-muted rounded-lg skeleton-loading'></div>
          </div>
        </div>

        <div className='flex items-center justify-center p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <span className='text-muted font-medium typing-indicator'>
              Loading puzzle...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {isOutOfGuesses ? (
        <div className='space-y-4'>
          {shouldShowSubscriptionCTA(isOutOfGuesses, isAuthenticated) && (
            <SubscriptionCTA />
          )}
          {shouldShowSignInCTA(isOutOfGuesses, isAuthenticated) && (
            <SignInCTA />
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <label
              htmlFor='answer-input'
              className='block text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100'
            >
              Your Answer
            </label>
            <div className='flex flex-col sm:flex-row gap-3 items-center'>
              <div className='relative flex-1'>
                <input
                  id='answer-input'
                  type='text'
                  value={userAnswer}
                  onChange={handleInputChange}
                  placeholder='Enter your answer...'
                  className={`
                    w-full px-6 py-4 text-base lg:text-lg border border-gray-300 dark:border-gray-600 rounded-xl
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    placeholder-gray-500 dark:placeholder-gray-400
                    transition-all duration-300 focus:border-blue-500 dark:focus:border-blue-400
                    focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:outline-none
                    disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
                    shadow-sm hover:shadow-md
                  `}
                  disabled={
                    submissionLoading || submissionResult?.isCorrect === true
                  }
                  autoComplete='off'
                />
                {/* Enhanced focus indicator */}
                <div className='absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-sky-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 peer-focus:opacity-100 pointer-events-none' />
              </div>
              <Button
                type='submit'
                disabled={
                  !userAnswer.trim() ||
                  submissionLoading ||
                  submissionResult?.isCorrect === true ||
                  (attemptStatus !== null &&
                    attemptStatus.remainingGuesses <= 0)
                }
                loading={submissionLoading}
                variant='submit'
                size='lg'
                className={`
                  sm:px-6 lg:px-8 sm:w-auto w-full interactive-button
                  ${showAnimation === 'incorrect' ? 'button-press' : ''}
                `}
              >
                {submissionLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {submissionResult && (
        <div
          className={`
            rounded-lg p-6 shadow-lg
            ${
              submissionResult.isCorrect
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20'
                : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
            }
          `}
        >
          {/* Particle effects container for success */}
          {submissionResult.isCorrect && (
            <div className='particles-container'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='particle'
                  style={{
                    left: `${20 + i * 10}%`,
                    animationDelay: `${i * 100}ms`,
                    background: `linear-gradient(45deg, hsl(${120 + i * 30}, 70%, 60%), hsl(${140 + i * 30}, 70%, 50%))`,
                  }}
                />
              ))}
            </div>
          )}

          <div className={`flex items-start gap-4`}>
            <div
              className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg
              ${
                submissionResult.isCorrect
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              }
            `}
            >
              {submissionResult.isCorrect ? '✓' : '✗'}
            </div>
            <div className='flex-1'>
              <p
                className={`text-lg font-semibold ${
                  submissionResult.isCorrect
                    ? 'text-emerald-800 dark:text-emerald-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {submissionResult.message}
              </p>
            </div>
          </div>

          {submissionResult.hint && submissionResult.hint.length > 0 && (
            <div className='mt-4 p-4 bg-blue-50/80 dark:bg-blue-900/30 rounded-lg animate-fade-in'>
              <h4 className='text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
                Hints:
              </h4>
              <div className='text-blue-700 dark:text-blue-300'>
                {submissionResult.hint}
              </div>
            </div>
          )}

          {submissionResult.isCorrect && (
            <div
              className='mt-6 text-center space-y-3 animate-fade-in'
              style={{ animationDelay: '0.3s' }}
            >
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full shadow-sm'>
                <svg
                  className='h-5 w-5 text-emerald-600 dark:text-emerald-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='font-semibold text-emerald-700 dark:text-emerald-300'>
                  Puzzle completed in{' '}
                  {attemptStatus ? attemptStatus.attemptCount : 1} attempt
                  {(attemptStatus ? attemptStatus.attemptCount : 1) !== 1
                    ? 's'
                    : ''}
                  !
                </span>
              </div>
              <p className='text-muted'>
                Come back tomorrow for the next puzzle!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Attempt Counter */}
      <div className='flex items-center justify-center'>
        <div className='inline-flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm'>
          <div className='flex items-center gap-2'>
            <svg
              className='h-4 w-4 text-gray-500 dark:text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              Guesses:{' '}
              {attemptStatus
                ? `${attemptStatus.attemptCount}/${attemptStatus.maxGuesses}`
                : '0/5'}
            </span>
          </div>

          {attemptStatus &&
            attemptStatus.remainingGuesses > 0 &&
            attemptStatus.attemptCount > 0 && (
              <div className='flex items-center gap-1'>
                <div className='w-1 h-1 bg-muted rounded-full'></div>
                <span className='text-xs text-muted'>
                  {attemptStatus.remainingGuesses} remaining
                </span>
              </div>
            )}

          {attemptStatus &&
            attemptStatus.remainingGuesses === 0 &&
            !submissionResult?.isCorrect && (
              <div className='flex items-center gap-1'>
                <div className='w-1 h-1 bg-red-400 rounded-full'></div>
                <span className='text-xs text-red-600 dark:text-red-400 font-medium'>
                  No attempts remaining
                </span>
              </div>
            )}
        </div>
      </div>

      {/* Only show give up button if puzzle is not completed and user has made at least one attempt */}
      {attemptStatus &&
        attemptStatus.attemptCount > 0 &&
        !submissionResult?.isCorrect &&
        !isOutOfGuesses && (
          <GiveUpButton
            puzzleId={puzzle.id}
            disabled={submissionLoading}
            onGiveUp={handleGiveUp}
          />
        )}
    </div>
  )
}
