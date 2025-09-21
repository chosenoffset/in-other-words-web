import { useState } from 'react'
import { useGiveUpPuzzle } from '@/hooks/usePuzzles'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui'

interface GiveUpButtonProps {
  puzzleId: string
  disabled?: boolean
  onGiveUp?: () => void
}

export function GiveUpButton({
  puzzleId,
  disabled = false,
  onGiveUp,
}: GiveUpButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const giveUpMutation = useGiveUpPuzzle()

  const handleGiveUp = async () => {
    try {
      await giveUpMutation.mutateAsync(puzzleId)
      onGiveUp?.()
      setShowConfirmation(false)
    } catch (error) {
      console.error('Failed to give up:', error)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <div className='give-up-container'>
      <SignedOut>
        <div className='give-up-unauthenticated'>
          <p className='muted'>
            <Link to='/sign-in' className='signin-link'>
              Sign in
            </Link>{' '}
            to give up and see the answer
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        {!showConfirmation ? (
          <Button
            type='button'
            onClick={() => setShowConfirmation(true)}
            disabled={disabled || giveUpMutation.isPending}
            variant='ghost'
          >
            Give Up
          </Button>
        ) : (
          <div className='give-up-confirmation'>
            <p className='give-up-warning'>
              Are you sure you want to give up? This will reveal the answer and
              end your current streak.
            </p>
            <div className='give-up-actions'>
              <Button
                type='button'
                onClick={handleGiveUp}
                disabled={giveUpMutation.isPending}
                loading={giveUpMutation.isPending}
                variant='destructive'
              >
                {giveUpMutation.isPending ? 'Giving up...' : 'Yes, Give Up'}
              </Button>
              <Button
                type='button'
                onClick={handleCancel}
                disabled={giveUpMutation.isPending}
                variant='secondary'
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {giveUpMutation.error && (
          <div className='give-up-error'>
            <p>Failed to give up. Please try again.</p>
          </div>
        )}
      </SignedIn>
    </div>
  )
}
