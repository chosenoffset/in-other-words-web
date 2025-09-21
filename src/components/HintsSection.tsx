import { useState } from 'react'
import type { PuzzleQuestion } from '@/hooks/schemas'
import { Button } from '@/components/ui'

interface HintsSectionProps {
  puzzle: PuzzleQuestion
  hasIncorrectGuess: boolean
}

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'MUSIC':
      return '🎵'
    case 'MOVIES_TV':
      return '🎬'
    case 'GAMES':
      return '🎮'
    case 'SPORTS':
      return '⚽'
    case 'BOOKS':
      return '📚'
    default:
      return '❓'
  }
}

const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case 'MOVIES_TV':
      return 'Movies & TV'
    case 'UNCATEGORIZED':
      return 'General'
    default:
      return category.charAt(0) + category.slice(1).toLowerCase()
  }
}

export function HintsSection({ puzzle, hasIncorrectGuess }: HintsSectionProps) {
  const [isCategoryRevealed, setIsCategoryRevealed] = useState(false)
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set())

  const revealCategory = () => {
    setIsCategoryRevealed(true)
  }

  const revealHint = (index: number) => {
    setRevealedHints(prev => new Set([...prev, index]))
  }

  const puzzleHints = puzzle.hints || []

  return (
    <div className='bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4'>
      {/* Simplified Header */}
      <div className='flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-600'>
        <div className='w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center'>
          <svg
            className='h-3 w-3 text-white'
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
        </div>
        <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
          Hints
        </h3>
      </div>

      {/* Simplified Category Hint */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
          <svg
            className='h-3 w-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z'
            />
          </svg>
          Category:
        </div>

        {isCategoryRevealed ? (
          <div className='p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md'>
            <div className='flex items-center gap-2'>
              <span className='text-lg'>
                {getCategoryIcon(puzzle.category)}
              </span>
              <span className='font-medium text-blue-800 dark:text-blue-200 text-sm'>
                {getCategoryDisplayName(puzzle.category)}
              </span>
            </div>
          </div>
        ) : (
          <Button
            variant='hint-reveal'
            onClick={revealCategory}
            className='w-full text-sm'
            size='sm'
          >
            <svg
              className='h-3 w-3 mr-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            Click to reveal category
          </Button>
        )}
      </div>

      {/* Simplified Puzzle Hints */}
      {puzzleHints.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            <svg
              className='h-3 w-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            Puzzle Hints:
          </div>

          <div className='space-y-2'>
            {puzzleHints.map((hint, index) => (
              <div key={index} className='space-y-1'>
                {revealedHints.has(index) ? (
                  <div className='p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-md'>
                    <div className='flex items-start gap-2'>
                      <div className='w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5'>
                        {index + 1}
                      </div>
                      <p className='text-purple-800 dark:text-purple-200 text-sm leading-relaxed'>
                        {hint}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant={hasIncorrectGuess ? 'hint-reveal' : 'secondary'}
                    onClick={() => revealHint(index)}
                    disabled={!hasIncorrectGuess}
                    className='w-full justify-start text-sm'
                    size='sm'
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          hasIncorrectGuess
                            ? 'bg-white dark:bg-gray-200 text-purple-600 dark:text-purple-700'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className='text-xs'>
                        {!hasIncorrectGuess
                          ? `Hint ${index + 1} (locked)`
                          : `Click to reveal hint ${index + 1}`}
                      </span>
                      {!hasIncorrectGuess && (
                        <svg
                          className='h-3 w-3 ml-auto'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                      )}
                    </div>
                  </Button>
                )}
              </div>
            ))}
          </div>

          {!hasIncorrectGuess && puzzleHints.length > 0 && (
            <div className='mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md'>
              <div className='flex items-center gap-2'>
                <svg
                  className='h-3 w-3 text-gray-600 dark:text-gray-400 flex-shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
                <span className='text-xs font-medium text-gray-800 dark:text-gray-200'>
                  Puzzle hints unlock after your first incorrect guess
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
