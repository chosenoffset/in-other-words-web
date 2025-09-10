import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TopNav } from '@/components/TopNav.tsx'
import { NotFound } from '@/components/NotFound.tsx'
import '@/styles.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <TopNav />
      <Outlet />
    </>
  ),
  notFoundComponent: () => <NotFound />,
  errorComponent: error => <div>Error: {error.error.message}</div>,
})
