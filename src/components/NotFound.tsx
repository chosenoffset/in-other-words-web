import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ marginBottom: '1rem' }}>Page not found</p>
      <Link to='/' preload='intent'>
        Go back home
      </Link>
    </div>
  )
}
