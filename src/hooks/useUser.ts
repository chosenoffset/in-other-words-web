import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'

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
