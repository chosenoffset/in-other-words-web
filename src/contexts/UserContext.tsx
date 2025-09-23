import type { ReactNode } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useGetCurrentUser, useIsClerkIdSuperAdmin } from '@/hooks/useUser'
import { UserContext, type UserContextValue } from './UserContextDefinition'

interface UserContextProviderProps {
  children: ReactNode
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const { isSignedIn } = useAuth()
  const { user: clerkUser } = useUser()
  const {
    data: appUser,
    isLoading: userLoading,
    error: userError,
  } = useGetCurrentUser()
  const { data: superAdminData, isLoading: adminLoading } =
    useIsClerkIdSuperAdmin(clerkUser?.id || '')

  // Derive subscription status from existing data structure
  const hasActiveSubscription = Boolean(
    appUser?.stripeSubscriptions?.some(s => s.status === 'ACTIVE')
  )

  const value: UserContextValue = {
    isAuthenticated: Boolean(isSignedIn),
    user: appUser || null,
    isSuperAdmin: Boolean(superAdminData),
    hasActiveSubscription,
    isLoading: userLoading || adminLoading,
    error: userError instanceof Error ? userError : null,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
