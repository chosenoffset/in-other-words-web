import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { z } from 'zod'
import { puzzleSchema, type Puzzle } from '@/hooks/schemas'

const SUPERADMIN_PUZZLES_KEY = ['superadmin', 'puzzles'] as const

export const useSuperadminGetPuzzles = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: SUPERADMIN_PUZZLES_KEY,
    queryFn: async () => {
      const token = await getToken()
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return z.array(puzzleSchema).parse(response.data)
    },
  })
}

export const useSuperadminGetPuzzle = (id: string | undefined) => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: [...SUPERADMIN_PUZZLES_KEY, id],
    enabled: Boolean(id),
    queryFn: async () => {
      const token = await getToken()
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return puzzleSchema.parse(response.data)
    },
  })
}

export const useSuperadminCreatePuzzle = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newPuzzle: Puzzle) => {
      const token = await getToken()
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles`,
        newPuzzle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return puzzleSchema.parse(response.data)
    },
    onSuccess: created => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_PUZZLES_KEY })
      queryClient.invalidateQueries({ queryKey: ['puzzles'] })
      queryClient.setQueryData<Puzzle[]>(SUPERADMIN_PUZZLES_KEY, existing =>
        existing ? [...existing, created] : [created]
      )
    },
  })
}

export const useSuperadminUpdatePuzzle = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (puzzle: Puzzle) => {
      const token = await getToken()
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles/${puzzle.id}`,
        puzzle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return puzzleSchema.parse(response.data)
    },
    onSuccess: updated => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_PUZZLES_KEY })
      queryClient.invalidateQueries({ queryKey: ['puzzles'] })
      queryClient.setQueryData<Puzzle[]>(
        SUPERADMIN_PUZZLES_KEY,
        existing =>
          existing?.map(p => (p.id === updated.id ? updated : p)) ?? [updated]
      )
      queryClient.setQueryData([...SUPERADMIN_PUZZLES_KEY, updated.id], updated)
    },
  })
}

export const useSuperadminSoftDeletePuzzle = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return puzzleSchema.parse(response.data)
    },
    onSuccess: deleted => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_PUZZLES_KEY })
      queryClient.invalidateQueries({ queryKey: ['puzzles'] })
      queryClient.removeQueries({
        queryKey: [...SUPERADMIN_PUZZLES_KEY, deleted.id],
      })
      queryClient.setQueryData<Puzzle[]>(
        SUPERADMIN_PUZZLES_KEY,
        existing => existing?.filter(p => p.id !== deleted.id) ?? []
      )
    },
  })
}

export const useSuperadminHardDeletePuzzle = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles/hard-delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return id
    },
    onSuccess: id => {
      queryClient.invalidateQueries({ queryKey: SUPERADMIN_PUZZLES_KEY })
      queryClient.invalidateQueries({ queryKey: ['puzzles'] })
      queryClient.removeQueries({
        queryKey: [...SUPERADMIN_PUZZLES_KEY, id],
      })
      queryClient.setQueryData<Puzzle[]>(
        SUPERADMIN_PUZZLES_KEY,
        existing => existing?.filter(p => p.id !== id) ?? []
      )
    },
  })
}
