import { useUserContext } from '@/hooks/useUserContext'

/**
 * Simple authentication status hook
 * @returns boolean indicating if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useUserContext()
  return isAuthenticated
}
