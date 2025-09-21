import { createFileRoute } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { PlayerStatsCard } from '@/components/PlayerStatsCard'
import { Button, Container } from '@/components/ui'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useUser()

  return (
    <main>
      <Container className='py-14'>
        <SignedOut>
          <div className='profile-unauthenticated'>
            <h1>Player Profile</h1>
            <p>You need to sign in to view your profile and statistics.</p>
            <Button asChild variant='signin'>
              <Link to='/sign-in'>Sign In</Link>
            </Button>
          </div>
        </SignedOut>

        <SignedIn>
          <div className='profile-content'>
            <header className='profile-header'>
              <h1>Player Profile</h1>
              {user && (
                <div className='user-info'>
                  <p className='user-name'>
                    Welcome back, {user.firstName || 'Player'}!
                  </p>
                  <p className='user-email muted'>
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </header>

            <section className='profile-stats'>
              <PlayerStatsCard />
            </section>
          </div>
        </SignedIn>
      </Container>
    </main>
  )
}
