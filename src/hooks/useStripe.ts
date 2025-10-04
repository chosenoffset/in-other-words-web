import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { z } from 'zod'

const redirectSchema = z.object({
  redirectUrl: z.string().url(),
})

export const useCreateSubscription = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<string, Error, void>({
    mutationFn: async () => {
      const token = await getToken()
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/app/stripe/create-subscription`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const parsed = redirectSchema.parse(response.data)
      return parsed.redirectUrl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export const useCreateBillingPortal = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<string, Error, void>({
    mutationFn: async () => {
      const token = await getToken()
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/app/stripe/billing-portal`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const parsed = redirectSchema.parse(response.data)
      return parsed.redirectUrl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
