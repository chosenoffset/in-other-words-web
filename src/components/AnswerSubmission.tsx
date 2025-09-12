import * as React from 'react'
import { useState } from 'react'
import type {
  AttemptStatus,
  PuzzleQuestion,
  PuzzleResult,
} from '@/hooks/schemas'
import { useSubmitAnswer } from '@/hooks/usePuzzles'

interface AnswerSubmissionProps {
  puzzle: PuzzleQuestion | null
  onSubmissionResult?: (result: PuzzleResult) => void
  initialAttemptStatus?: AttemptStatus | null
}

export function AnswerSubmission({
  puzzle,
  onSubmissionResult,
  initialAttemptStatus,
}: AnswerSubmissionProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<PuzzleResult | null>(
    null
  )
  const [attemptStatus, setAttemptStatus] = useState<AttemptStatus | null>(
    initialAttemptStatus || null
  )
  
  // Update attemptStatus when initialAttemptStatus changes from API
  React.useEffect(() => {
    if (initialAttemptStatus) {
      setAttemptStatus(initialAttemptStatus)
    }
  }, [initialAttemptStatus])

  const submitAnswer = useSubmitAnswer()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!puzzle || !userAnswer.trim() || isSubmitting) {
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
      setIsSubmitting(true)

      const api = await submitAnswer.mutateAsync({
        puzzleId: puzzle.id,
        userAnswer: userAnswer.trim(),
        timestamp: new Date(),
      })

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

      // Update attempt status from API response
      if (
        result.remainingGuesses !== undefined &&
        result.maxGuesses !== undefined
      ) {
        setAttemptStatus({
          attemptCount:
            (result.maxGuesses || 0) - (result.remainingGuesses || 0),
          remainingGuesses: result.remainingGuesses,
          maxGuesses: result.maxGuesses,
        })
      }

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
              disabled={isSubmitting || submissionResult?.isCorrect === true}
              autoComplete='off'
            />
            <button
              type='submit'
              disabled={
                !userAnswer.trim() ||
                isSubmitting ||
                submissionResult?.isCorrect === true ||
                (attemptStatus !== null && attemptStatus.remainingGuesses <= 0)
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
              <ul className='hints-list'>{submissionResult.hint}</ul>
            </div>
          )}

          {submissionResult.isCorrect && (
            <div className='success-actions'>
              <p className='completion-text'>
                Puzzle completed in{' '}
                {attemptStatus ? attemptStatus.attemptCount : 1} attempt
                {(attemptStatus ? attemptStatus.attemptCount : 1) !== 1
                  ? 's'
                  : ''}
                !
              </p>
              <p className='next-puzzle-text muted'>
                Come back tomorrow for the next puzzle!
              </p>
            </div>
          )}
        </div>
      )}

      <div className='attempt-counter'>
        <p className='muted'>
          {attemptStatus ? (
            <>
              Guesses: {attemptStatus.attemptCount}/{attemptStatus.maxGuesses}
              {attemptStatus.remainingGuesses > 0 && attemptStatus.attemptCount > 0 && (
                <> • {attemptStatus.remainingGuesses} remaining</>
              )}
              {attemptStatus.remainingGuesses === 0 &&
                !submissionResult?.isCorrect && <> • No attempts remaining</>}
            </>
          ) : (
            'Guesses: 0 of 5'
          )}
        </p>
      </div>
    </div>
  )
}
