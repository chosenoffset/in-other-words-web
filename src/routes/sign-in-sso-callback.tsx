import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useCreateUser } from '@/hooks/useRegister.ts'
import { Spinner } from '@/components/Spinner.tsx'

export const Route = createFileRoute('/sign-in-sso-callback')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterSsoCallbackClient />
}

function RegisterSsoCallbackClient() {
  const { handleRedirectCallback } = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
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
    if (createUser.status === 'idle' || createUser.status === 'error') {
      createUser.mutate(undefined, {
        onSettled: () => {
          navigate({ to: '/' })
        },
      })
    }
  }, [isLoaded, isSignedIn, user, createUser, navigate])

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
