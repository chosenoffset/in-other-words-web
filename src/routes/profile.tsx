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
          <div className='text-center py-16 px-5'>
            <h1 className='mb-4 text-[2rem] font-bold'>Player Profile</h1>
            <p className='mb-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed'>
              You need to sign in to view your profile and statistics.
            </p>
            <Button asChild variant='signin'>
              <Link to='/sign-in'>Sign In</Link>
            </Button>
          </div>
        </SignedOut>

        <SignedIn>
          <div className='max-w-3xl mx-auto p-5'>
            <header className='mb-8'>
              <h1 className='mb-4 text-[2rem] font-bold'>Player Profile</h1>
              {user && (
                <div className='bg-white dark:bg-gray-900 border border-border rounded-xl p-5'>
                  <p className='mb-1 text-[1.125rem] font-semibold'>
                    Welcome back, {user.firstName || 'Player'}!
                  </p>
                  <p className='m-0 text-sm text-gray-600 dark:text-gray-300'>
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </header>

            <section className='mt-6'>
              <PlayerStatsCard />
            </section>
          </div>
        </SignedIn>
      </Container>
    </main>
  )
}
