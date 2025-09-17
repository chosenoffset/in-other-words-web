import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { transactionSchema, type Transaction } from '@/hooks/schemas'

// Hook only fetches/parses data; UI handles presentation
export const useGetTransaction = (transactionId: string | undefined) => {
  const { getToken } = useAuth()
  return useQuery<Transaction | null>({
    queryKey: ['transaction', transactionId],
    enabled: Boolean(transactionId),
    queryFn: async () => {
      if (!transactionId) return null
      try {
        const token = await getToken()
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/app/transactions/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        return transactionSchema.parse(response.data)
      } catch (error) {
        console.error('Failed to load transaction', error)
        return null
      }
    },
  })
}
