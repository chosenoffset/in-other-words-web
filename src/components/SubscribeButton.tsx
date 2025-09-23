import { useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useCreateSubscription } from '@/hooks/useStripe'
import { useUserContext } from '@/hooks/useUserContext'
import { Button } from '@/components/ui'

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
  const { isAuthenticated } = useUserContext()
  const createSubscription = useCreateSubscription()

  const handleClick = useCallback(async () => {
    try {
      const url = await createSubscription.mutateAsync()
      onRedirect?.(url)
      window.location.assign(url)
    } catch (err) {
      // Swallow here; UI should decide how to surface errors where used
      console.error('Failed to create subscription', err)
    }
  }, [createSubscription, onRedirect])

  return (
    <div className={className}>
      {!isAuthenticated ? (
        <Button asChild variant='primary'>
          <Link to='/sign-in'>Sign in to subscribe</Link>
        </Button>
      ) : (
        <Button
          type='button'
          onClick={handleClick}
          disabled={disabled || createSubscription.isPending}
          loading={createSubscription.isPending}
          variant='primary'
        >
          {createSubscription.isPending
            ? 'Redirecting…'
            : children || 'Subscribe'}
        </Button>
      )}
    </div>
  )
}
