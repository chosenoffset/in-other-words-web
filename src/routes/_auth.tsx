import {
  createFileRoute,
  Outlet,
  notFound,
  ClientOnly,
} from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'
import { getIsClerkIdSuperAdmin } from '@/hooks/useUser.ts'
import { useEffect } from 'react'
import { Spinner } from '@/components/Spinner'

export const Route = createFileRoute('/_auth')({
  component: AuthGate,
})

function AuthGate() {
  return (
    <ClientOnly>
      <AuthGateClient />
    </ClientOnly>
  )
}

function AuthGateClient() {
  const { user, isLoaded } = useUser()
  const { data: isSuperAdmin, isLoading: isSuperAdminLoading } =
    getIsClerkIdSuperAdmin(user?.id || '')

  useEffect(() => {
    if (isLoaded && !user) {
      throw notFound()
    }
  }, [isLoaded, user])

  if (isLoaded && user && !isSuperAdminLoading && !isSuperAdmin) {
    throw notFound()
  }

  if (!isLoaded || (user && isSuperAdminLoading)) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
        <Spinner aria-label='Authorizing' />
      </div>
    )
  }

  // If not logged in, navigation will have already occurred
  // If not superadmin, a notFound boundary will render
  return <Outlet />
}
