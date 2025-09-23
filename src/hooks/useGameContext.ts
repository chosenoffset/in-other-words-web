import { useContext } from 'react'
import {
  GameContext,
  type GameContextValue,
} from '@/contexts/GameContextDefinition'

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }
  return context
}
