import { useState } from 'react'
import { useGiveUpPuzzle } from '@/hooks/usePuzzles'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

interface GiveUpButtonProps {
  puzzleId: string
  disabled?: boolean
  onGiveUp?: () => void
}

export function GiveUpButton({ puzzleId, disabled = false, onGiveUp }: GiveUpButtonProps) {
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
    <div className="give-up-container">
      <SignedOut>
        <div className="give-up-unauthenticated">
          <p className="muted">
            <Link to="/sign-in" className="signin-link">Sign in</Link> to give up and see the answer
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        {!showConfirmation ? (
          <button
            type="button"
            onClick={() => setShowConfirmation(true)}
            disabled={disabled || giveUpMutation.isPending}
            className="give-up-button"
          >
            Give Up
          </button>
        ) : (
          <div className="give-up-confirmation">
            <p className="give-up-warning">
              Are you sure you want to give up? This will reveal the answer and end your current streak.
            </p>
            <div className="give-up-actions">
              <button
                type="button"
                onClick={handleGiveUp}
                disabled={giveUpMutation.isPending}
                className="danger-button"
              >
                {giveUpMutation.isPending ? 'Giving up...' : 'Yes, Give Up'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={giveUpMutation.isPending}
                className="secondary-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {giveUpMutation.error && (
          <div className="give-up-error">
            <p>Failed to give up. Please try again.</p>
          </div>
        )}
      </SignedIn>
    </div>
  )
}