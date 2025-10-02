import { Button } from '@/components/ui'
import { usePuzzleHints } from '@/hooks/usePuzzles'
import type { PuzzleQuestion } from '@/hooks/schemas'
import type { GuessHistoryItem } from '@/hooks/useGuessHistory'

interface GuessHistoryListProps {
  puzzle: PuzzleQuestion
  guesses: GuessHistoryItem[]
  onRevealHint: (guessId: string, hintIndex: number) => void
}

export function GuessHistoryList({
  puzzle,
  guesses,
  onRevealHint,
}: GuessHistoryListProps) {
  // Collect all hint indices that have been revealed across all guesses
  const allRevealedHints = new Set<number>()
  guesses.forEach(guess => {
    guess.revealedHintIndices.forEach(h => allRevealedHints.add(h))
  })

  // Fetch hint text for all revealed hints using existing hook
  const { data: hintsData } = usePuzzleHints(puzzle.id, allRevealedHints)

  const getNextAvailableHint = (guess: GuessHistoryItem): number | null => {
    const totalHints = puzzle.num_hints || 0
    for (let i = 0; i < totalHints; i++) {
      if (!guess.revealedHintIndices.includes(i)) {
        return i
      }
    }
    return null // All hints revealed
  }

  // Sort guesses chronologically (oldest first)
  const sortedGuesses = [...guesses].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  // Don't render anything if no guesses
  if (sortedGuesses.length === 0) {
    return null
  }

  return (
    <div className='space-y-2'>
      {/* Header */}
      <h3 className='text-xs font-semibold text-gray-600 dark:text-gray-400 px-0.5'>
        Previous Guesses
      </h3>

      {/* Guess list */}
      <div className='rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 overflow-hidden'>
        {sortedGuesses.map(guess => {
          const nextHintIndex = getNextAvailableHint(guess)

          return (
            <div
              key={guess.id}
              className={`
                p-2.5 transition-all
                ${
                  guess.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-transparent'
                }
              `}
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  {/* Guess text */}
                  <div className='flex items-center gap-1.5'>
                    <p
                      className={`
                      text-sm font-medium
                      ${
                        guess.isCorrect
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }
                    `}
                    >
                      &quot;{guess.guessText}&quot;
                    </p>
                    {guess.isCorrect && (
                      <svg
                        className='w-4 h-4 text-green-600 dark:text-green-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>

                  {/* Revealed hints for this guess */}
                  {guess.revealedHintIndices.length > 0 && (
                    <div className='space-y-1.5 mt-1.5'>
                      {guess.revealedHintIndices.map(hintIndex => (
                        <div
                          key={hintIndex}
                          className='bg-blue-50 dark:bg-blue-900/20 rounded p-1.5 border border-blue-200 dark:border-blue-700'
                        >
                          <div className='flex items-start gap-1.5'>
                            <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                              💡
                            </span>
                            <div className='text-xs text-blue-900 dark:text-blue-100 flex-1'>
                              {hintsData?.[hintIndex] || 'Loading...'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hint reveal button - only for incorrect guesses with available hints */}
                {!guess.isCorrect && nextHintIndex !== null && (
                  <Button
                    variant='hint-reveal'
                    size='sm'
                    onClick={() => onRevealHint(guess.id, nextHintIndex)}
                    className='shrink-0 text-xs px-2.5 py-1 h-auto'
                  >
                    💡
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
