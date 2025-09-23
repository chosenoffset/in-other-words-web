import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { routeTree } from './routeTree.gen'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { UserContextProvider } from '@/contexts/UserContext'
import { GameContextProvider } from '@/contexts/GameContext'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ThemeProvider>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
          afterSignOutUrl='/'
        >
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              <GameContextProvider>
                <RouterProvider router={router} />
              </GameContextProvider>
            </UserContextProvider>
          </QueryClientProvider>
        </ClerkProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
