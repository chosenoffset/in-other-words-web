import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { TopNav } from '@/components/TopNav.tsx'
import '@/styles.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <TopNav />
      <Outlet />
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
    </>
  ),
  notFoundComponent: () => <div>Page not found!</div>,
  errorComponent: () => <div>Error</div>,
})
