import type { PuzzleQuestion } from '@/hooks/schemas'

interface PuzzleOfTheDayProps {
  puzzle: PuzzleQuestion
}

export function PuzzleOfTheDay({ puzzle }: PuzzleOfTheDayProps) {
  return (
    <div className='space-y-6'>
      {/* Enhanced Header with Gradient Background */}
      <div className='text-center space-y-3'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 animate-fade-in'>
          <svg
            className='h-4 w-4 text-gray-700 dark:text-sky-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h2 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-100 animate-slide-in-up'>
          Today&apos;s Puzzle
        </h2>
      </div>

      {/* Enhanced Clue Section with Better Visual Hierarchy */}
      <div className='relative'>
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm animate-reveal-hint'>
          {/* Quote Icon */}
          <div className='absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg'>
            <svg
              className='h-4 w-4 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z' />
            </svg>
          </div>

          {/* Mirrored Quote Icon */}
          <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform rotate-180'>
            <svg
              className='h-4 w-4 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z' />
            </svg>
          </div>

          <p className='text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed italic pl-4 pr-4'>
            {puzzle.question}
          </p>
        </div>
      </div>

      {/* Enhanced Instruction with Icon */}
      <div className='text-center'>
        <div
          className='inline-flex items-center gap-2 text-muted animate-fade-in'
          style={{ animationDelay: '0.3s' }}
        >
          <svg
            className='h-5 w-5 text-amber-500'
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
          <span className='font-medium text-gray-700 dark:text-gray-300'>
            What phrase is this clue describing?
          </span>
        </div>
      </div>
    </div>
  )
}
