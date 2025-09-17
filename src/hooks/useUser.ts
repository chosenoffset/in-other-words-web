import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { userSchema, type User } from '@/hooks/schemas'

export const getIsClerkIdSuperAdmin = (clerkId: string) => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['isClerkIdSuperAdmin', clerkId],
    queryFn: async () => {
      const token = await getToken()
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/app/users/clerk/superadmin`,
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

export const useGetCurrentUser = () => {
  const { getToken } = useAuth()
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const token = await getToken()
        if (!token) return null
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/app/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        return userSchema.parse(response.data)
      } catch (err) {
        console.error('Failed to load current user', err)
        return null
      }
    },
  })
}
