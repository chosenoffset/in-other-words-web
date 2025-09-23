import { Button } from '@/components/ui'
import { Link } from '@tanstack/react-router'

export function SignInCTA() {
  return (
    <div
      className='
        rounded-lg p-6 border-2 shadow-lg
        bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20
        border-green-200 dark:border-green-700
      '
    >
      <div className='flex items-start gap-4'>
        <div
          className='
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg
            bg-gradient-to-r from-green-500 to-emerald-500
          '
        >
          →
        </div>
        <div className='flex-1'>
          <p className='text-lg font-semibold text-green-800 dark:text-green-200'>
            You&#39;re out of guesses for today.
          </p>
          <p className='muted mt-1'>
            Sign in to get extra guesses and track your progress.
          </p>
          <div className='mt-4'>
            <Button asChild variant='primary'>
              <Link to='/sign-in'>Sign in for more guesses</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
