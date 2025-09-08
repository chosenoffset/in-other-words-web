import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { TopNav } from '@/components/TopNav.tsx'
import { ClientOnly } from '@/components/ClientOnly.tsx'
import { NotFound } from '@/components/NotFound.tsx'
import '@/styles.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <TopNav />
      <Outlet />
      <ClientOnly>
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </ClientOnly>
    </>
  ),
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <div>Error</div>,
})
