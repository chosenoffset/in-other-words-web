/** @jsxImportSource react */
import type { Puzzle } from '../types/puzzle'

interface PuzzleOfTheDayProps {
  puzzle: Puzzle
}

export function PuzzleOfTheDay({ puzzle }: PuzzleOfTheDayProps) {
  return (
    <div className='puzzle-container'>
      <div className='puzzle-header'>
        <div className='puzzle-meta'>
          <span className='puzzle-date'>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className='puzzle-content'>
        <h2 className='puzzle-title'>Today&apos;s Puzzle</h2>
        <div className='puzzle-clue'>
          <p className='clue-text'>{puzzle.question}</p>
        </div>
        <p className='puzzle-instruction'>
          What phrase is this clue describing?
        </p>
      </div>
    </div>
  )
}
