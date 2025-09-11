import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClerk, useUser, useAuth } from '@clerk/clerk-react'
import { useCreateUser } from '@/hooks/useRegister.ts'
import { Spinner } from '@/components/Spinner.tsx'
import { ClientOnly } from '@/components/ClientOnly.tsx'
import { convertAnonymousAttempts } from '@/services/puzzleApi.ts'

export const Route = createFileRoute('/sign-in-sso-callback')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ClientOnly>
      <RegisterSsoCallbackClient />
    </ClientOnly>
  )
}

function RegisterSsoCallbackClient() {
  const { handleRedirectCallback } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const createUser = useCreateUser()

  useEffect(() => {
    if (!user && isLoaded) {
      handleRedirectCallback({
        signUpForceRedirectUrl: '/sign-in-sso-callback',
        signInForceRedirectUrl: '/sign-in-sso-callback',
      })
    }
  }, [user, isLoaded, handleRedirectCallback])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    if (!user) return
    
    // Convert anonymous attempts for both new and existing users
    const convertAndNavigate = async () => {
      try {
        const token = await getToken()
        if (token) {
          await convertAnonymousAttempts(token)
        }
      } catch (error) {
        console.error('Failed to convert anonymous attempts:', error)
        // Don't block navigation if conversion fails
      }
      navigate({ to: '/' })
    }
    
    if (createUser.status === 'idle' || createUser.status === 'error') {
      createUser.mutate(undefined, {
        onSettled: convertAndNavigate,
      })
    } else if (createUser.status === 'success') {
      // User already exists, just convert attempts and navigate
      convertAndNavigate()
    }
  }, [isLoaded, isSignedIn, user, createUser, navigate, getToken])

  return (
    <main className='container'>
      <section className='shell' aria-label='Setting up your account'>
        <div
          className='shell-inner'
          style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}
        >
          <Spinner aria-label='Setting up your account' />
        </div>
      </section>
    </main>
  )
}
