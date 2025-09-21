import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { NavLinks, type AppNavLink } from './NavLinks'
import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function TopNav() {
  const links: AppNavLink[] = [
    { to: '/', label: 'Home', exact: true },
    { to: '/profile', label: 'Profile', exact: true },
  ]

  return (
    <nav
      className='sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'
      role='navigation'
      aria-label='Primary'
    >
      <div className='flex items-center justify-between max-w-4xl mx-auto px-5 py-3'>
        <div>
          <Link
            to='/'
            preload='intent'
            className='inline-flex items-center gap-2.5 font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            <span
              className='grid place-items-center w-10 h-8 rounded-lg bg-blue-500 text-white font-extrabold text-sm tracking-tight'
              aria-hidden
            >
              IOW
            </span>
            <span className='text-lg tracking-tight'>In Other Words</span>
          </Link>
        </div>

        <div className='flex items-center gap-2.5'>
          <div className='hidden md:block'>
            <NavLinks links={links} orientation='horizontal' />
          </div>

          <div className='flex items-center gap-2.5'>
            <ThemeToggle />
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: 32, height: 32 },
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <Button asChild variant='signin' size='sm'>
                <Link to='/sign-in' preload='intent'>
                  Sign in
                </Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}
