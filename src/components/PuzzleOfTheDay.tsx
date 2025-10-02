import { useState } from 'react'
import type { PuzzleQuestion } from '@/hooks/schemas'
import { Button } from '@/components/ui'

interface PuzzleOfTheDayProps {
  puzzle: PuzzleQuestion
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

export function PuzzleOfTheDay({ puzzle }: PuzzleOfTheDayProps) {
  const [isCategoryRevealed, setIsCategoryRevealed] = useState(false)

  return (
    <div className='space-y-3'>
      {/* Category Hint */}
      <div className='space-y-1.5'>
        {isCategoryRevealed ? (
          <div className='flex items-center gap-2 text-sm'>
            <span className='text-base'>
              {getCategoryIcon(puzzle.category)}
            </span>
            <span className='font-medium text-gray-700 dark:text-gray-300'>
              {getCategoryDisplayName(puzzle.category)}
            </span>
          </div>
        ) : (
          <Button
            variant='hint-reveal'
            onClick={() => setIsCategoryRevealed(true)}
            className='text-xs px-3 py-1.5'
            size='sm'
          >
            Reveal Category
          </Button>
        )}
      </div>

      <div className='relative'>
        <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md animate-reveal-hint'>
          <p className='text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed'>
            {puzzle.question}
          </p>
        </div>
      </div>
    </div>
  )
}
