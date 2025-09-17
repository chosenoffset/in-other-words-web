import { useCallback } from 'react'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { useCreateSubscription } from '@/hooks/useStripe'

type SubscribeButtonProps = {
  className?: string
  children?: React.ReactNode
  onRedirect?: (url: string) => void
  disabled?: boolean
}

export function SubscribeButton({
  className,
  children,
  onRedirect,
  disabled,
}: SubscribeButtonProps) {
  const createSubscription = useCreateSubscription()

  const handleClick = useCallback(async () => {
    try {
      const url = await createSubscription.mutateAsync()
      onRedirect?.(url)
      window.location.assign(url)
    } catch (err) {
      // Swallow here; UI should decide how to surface errors where used
      // eslint-disable-next-line no-console
      console.error('Failed to create subscription', err)
    }
  }, [createSubscription, onRedirect])

  return (
    <div className={className}>
      <SignedOut>
        <Link to='/sign-in' className='primary-button'>
          Sign in to subscribe
        </Link>
      </SignedOut>
      <SignedIn>
        <button
          type='button'
          onClick={handleClick}
          disabled={disabled || createSubscription.isPending}
          className='primary-button'
        >
          {createSubscription.isPending
            ? 'Redirecting…'
            : children || 'Subscribe'}
        </button>
      </SignedIn>
    </div>
  )
}
