/** @jsxImportSource react */
import { useEffect, useState } from 'react'
import type { Puzzle, PuzzleResult } from '../types/puzzle'
import { submitAnswer } from '../services/puzzleApi'

interface AnswerSubmissionProps {
  puzzle: Puzzle | null
  onSubmissionResult?: (result: PuzzleResult) => void
}

export function AnswerSubmission({
  puzzle,
  onSubmissionResult,
}: AnswerSubmissionProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<PuzzleResult | null>(
    null
  )
  const [attemptCount, setAttemptCount] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    console.log('AnswerSubmission hydrated!')
    setIsHydrated(true)
  }, [])

  console.log('AnswerSubmission render, hydrated:', isHydrated)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!puzzle || !userAnswer.trim() || isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const result = await submitAnswer({
        puzzleId: puzzle.id,
        userAnswer: userAnswer.trim(),
        timestamp: new Date(),
      })

      setSubmissionResult(result)
      setAttemptCount(prev => prev + 1)
      onSubmissionResult?.(result)

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Set the user answer:', e.currentTarget.value)
    setUserAnswer(e.target.value)
    // Clear previous result when user starts typing again
    if (submissionResult) {
      setSubmissionResult(null)
    }
  }

  if (!puzzle) {
    return (
      <div className='answer-container'>
        <div className='answer-placeholder'>
          <p className='muted'>Loading puzzle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='answer-container'>
      <form onSubmit={handleSubmit} className='answer-form'>
        <div className='input-group'>
          <label htmlFor='answer-input' className='answer-label'>
            Your Answer
          </label>
          <div className='input-wrapper'>
            <input
              id='answer-input'
              type='text'
              value={userAnswer}
              onChange={handleInputChange}
              placeholder='Enter your answer...'
              className='answer-input'
              disabled={isSubmitting || submissionResult?.isCorrect}
              autoComplete='off'
            />
            <button
              type='submit'
              disabled={
                !userAnswer.trim() ||
                isSubmitting ||
                submissionResult?.isCorrect
              }
              className='submit-button'
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>

      {submissionResult && (
        <div
          className={`submission-result ${submissionResult.isCorrect ? 'correct' : 'incorrect'}`}
        >
          <div className='result-message'>
            <span
              className={`result-icon ${submissionResult.isCorrect ? 'success' : 'error'}`}
            >
              {submissionResult.isCorrect ? '✓' : '✗'}
            </span>
            <p>{submissionResult.message}</p>
          </div>

          {submissionResult.hint && submissionResult.hint.length > 0 && (
            <div className='hints-section'>
              <h4 className='hints-title'>Hints:</h4>
              <ul className='hints-list'>
                {submissionResult.hint}
              </ul>
            </div>
          )}

          {submissionResult.isCorrect && (
            <div className='success-actions'>
              <p className='completion-text'>
                Puzzle completed in {attemptCount} attempt
                {attemptCount !== 1 ? 's' : ''}!
              </p>
              <p className='next-puzzle-text muted'>
                Come back tomorrow for the next puzzle!
              </p>
            </div>
          )}
        </div>
      )}

      {attemptCount > 0 && !submissionResult?.isCorrect && (
        <div className='attempt-counter'>
          <p className='muted'>Attempts: {attemptCount}</p>
        </div>
      )}
    </div>
  )
}
