import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { userSchema } from '@/hooks/schemas'

export const useCreateUserFromClerkId = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({ clerkId }: { clerkId: string }) => {
      const token = await getToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/public/register/${clerkId}`,
        {},
        headers ? { headers } : undefined
      )
      const createdUser = userSchema.parse(response.data)
      return createdUser
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
