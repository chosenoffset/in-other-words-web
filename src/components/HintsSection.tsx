import { useState } from 'react'
import type { PuzzleQuestion } from '@/hooks/schemas'

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
    <div className="hints-section">
      <h3 className="hints-header">Hints</h3>

      {/* Category Hint */}
      <div className="hint-item">
        <div className="hint-label">Category:</div>
        <div className="hint-row">
          <div className="hint-icon">💡</div>
          {isCategoryRevealed ? (
            <div className="hint-content revealed">
              {getCategoryIcon(puzzle.category)} {getCategoryDisplayName(puzzle.category)}
            </div>
          ) : (
            <button
              className="hint-reveal-button"
              onClick={revealCategory}
            >
              Click to reveal category
            </button>
          )}
        </div>
      </div>

      {/* Puzzle Hints */}
      {puzzleHints.length > 0 && (
        <div className="puzzle-hints">
          <div className="hint-label">Puzzle Hints:</div>
          {puzzleHints.map((hint, index) => (
            <div key={index} className="hint-item">
              <div className="hint-row">
                <div className="hint-icon">💡</div>
                {revealedHints.has(index) ? (
                  <div className="hint-content revealed">
                    {index + 1}. {hint}
                  </div>
                ) : (
                  <button
                    className="hint-reveal-button"
                    onClick={() => revealHint(index)}
                    disabled={!hasIncorrectGuess}
                    title={!hasIncorrectGuess ? "Available after first incorrect guess" : ""}
                  >
                    {!hasIncorrectGuess
                      ? `Hint ${index + 1} (locked)`
                      : `Click to reveal hint ${index + 1}`
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
          {!hasIncorrectGuess && puzzleHints.length > 0 && (
            <div className="hints-locked-message">
              Puzzle hints unlock after your first incorrect guess
            </div>
          )}
        </div>
      )}
    </div>
  )
}