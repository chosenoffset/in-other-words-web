import { SubscribeButton } from './SubscribeButton'

export function SubscriptionCTA() {
  return (
    <div
      className='
        rounded-lg p-6 border-2 shadow-lg
        bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20
        border-blue-200 dark:border-blue-700
      '
    >
      <div className='flex items-start gap-4'>
        <div
          className='
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg
            bg-gradient-to-r from-blue-500 to-sky-500
          '
        >
          !
        </div>
        <div className='flex-1'>
          <p className='text-lg font-semibold text-blue-800 dark:text-blue-200'>
            You&#39;re out of guesses for today.
          </p>
          <p className='muted mt-1'>
            Subscribe to get extra guesses and keep playing.
          </p>
          <div className='mt-4'>
            <SubscribeButton>Get extra guesses</SubscribeButton>
          </div>
        </div>
      </div>
    </div>
  )
}
