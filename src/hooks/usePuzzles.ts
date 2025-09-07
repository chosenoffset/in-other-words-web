import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { puzzleSchema } from '@/hooks/schemas'

export const useGetPublishedPuzzles = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['puzzles'],
    queryFn: async () => {
      const token = await getToken()
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/app/puzzles`,
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
