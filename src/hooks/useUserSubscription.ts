import { useUserContext } from '@/hooks/useUserContext'

/**
 * Subscription status access hook
 * @returns subscription-related state and helper methods
 */
export function useUserSubscription() {
  const { hasActiveSubscription, isLoading } = useUserContext()

  return {
    hasActiveSubscription,
    isLoading,
    // Helper method to check if user should see subscription CTA
    shouldShowSubscriptionCTA: (
      isOutOfGuesses: boolean,
      isAuthenticated: boolean
    ) => {
      return isOutOfGuesses && isAuthenticated && !hasActiveSubscription
    },
    // Helper method to check if user should see sign-in CTA
    shouldShowSignInCTA: (
      isOutOfGuesses: boolean,
      isAuthenticated: boolean
    ) => {
      return isOutOfGuesses && !isAuthenticated
    },
  }
}
