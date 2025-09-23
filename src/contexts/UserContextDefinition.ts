import { createContext } from 'react'
import type { User } from '@/hooks/schemas'

export interface UserContextValue {
  // Auth State (from existing Clerk integration)
  isAuthenticated: boolean
  user: User | null

  // Permissions (from existing useIsClerkIdSuperAdmin)
  isSuperAdmin: boolean

  // Subscription State (matches existing PlayerStatsCard logic)
  hasActiveSubscription: boolean // derived from stripeSubscriptions.some(s => s.status === 'ACTIVE')

  // Loading States
  isLoading: boolean
  error: Error | null
}

export const UserContext = createContext<UserContextValue | null>(null)
