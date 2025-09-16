import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { NavLinks, type AppNavLink } from './NavLinks'

export function TopNav() {
  const links: AppNavLink[] = [
    { to: '/', label: 'Home', exact: true },
    { to: '/profile', label: 'Profile', exact: true }
  ]

  return (
    <nav className='topnav' role='navigation' aria-label='Primary'>
      <div className='nav-container'>
        <div className='brand'>
          <Link to='/' preload='intent' className='brand-link'>
            <span className='brand-mark' aria-hidden>
              IOW
            </span>
            <span className='brand-name'>In Other Words</span>
          </Link>
        </div>

        <div className='flex-container'>
          <div className='nav-desktop'>
            <NavLinks links={links} orientation='horizontal' />
          </div>

          <div className='nav-actions'>
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
              <Link to='/sign-in' preload='intent' className='signin-button'>
                Sign in
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}
