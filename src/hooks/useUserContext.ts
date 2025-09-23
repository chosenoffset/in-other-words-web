import { useContext } from 'react'
import {
  UserContext,
  type UserContextValue,
} from '@/contexts/UserContextDefinition'

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}
