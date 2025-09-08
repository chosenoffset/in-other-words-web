import {
  createRequestHandler,
  defaultStreamHandler,
} from '@tanstack/react-router/ssr/server'
import { createRouter } from './router'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderToPipeableStream } from 'react-dom/server'

export async function render({ request }: { request: Request }) {
  const handler = createRequestHandler({ request, createRouter })

  // Wrap the streamed React tree with a no-op ClerkProvider to satisfy
  // components that check for context on the server. Clerk UI will still
  // render only on the client; this prevents server crashes.
  return handler(opts => {
    const queryClient = new QueryClient()
    return defaultStreamHandler({
      ...opts,
      wrap: element => (
        <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY}>
          <QueryClientProvider client={queryClient}>
            {element}
          </QueryClientProvider>
        </ClerkProvider>
      ),
    })
  })
}
