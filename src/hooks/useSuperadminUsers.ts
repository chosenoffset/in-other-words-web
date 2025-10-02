import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'

export const useSuperadminDeleteUserAttempts = () => {
  const { getToken } = useAuth()
  return useMutation({
    mutationFn: async (userId: string) => {
      const token = await getToken()
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/superadmin/puzzles/user/${userId}/attempts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    },
  })
}
