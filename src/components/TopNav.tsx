import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/clerk-react'
import { NavLinks, type AppNavLink } from './NavLinks'
import { ClientOnly } from './ClientOnly'

export function TopNav() {
  const [open, setOpen] = useState(false)

  const links: AppNavLink[] = [{ to: '/', label: 'Home', exact: true }]

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

        <div className='nav-desktop'>
          <NavLinks links={links} orientation='horizontal' />
        </div>

        <div className='nav-actions'>
          <ClientOnly>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: { userButtonAvatarBox: { width: 32, height: 32 } },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <button className='signin-button' type='button'>
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </ClientOnly>
        </div>

        <button
          className='nav-toggle'
          aria-label='Toggle navigation menu'
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className='nav-toggle-bar' />
          <span className='nav-toggle-bar' />
          <span className='nav-toggle-bar' />
        </button>
      </div>

      {open && (
        <div className='nav-mobile'>
          <NavLinks
            links={links}
            orientation='vertical'
            onLinkClick={() => setOpen(false)}
          />
        </div>
      )}
    </nav>
  )
}
