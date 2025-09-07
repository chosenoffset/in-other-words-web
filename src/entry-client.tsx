import { hydrateRoot } from 'react-dom/client'
import { RouterClient } from '@tanstack/react-router/ssr/client'
import { createRouter } from './router'
import { ClerkProvider } from '@clerk/clerk-react'
import './styles.css'

const router = createRouter()

hydrateRoot(
  document,
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <RouterClient router={router} />
  </ClerkProvider>
)
