import { Link } from '@tanstack/react-router'

export type AppNavLink = {
  to: string
  label: string
  exact?: boolean
}

type NavLinksProps = {
  links: AppNavLink[]
  orientation?: 'horizontal' | 'vertical'
  onLinkClick?: () => void
  defaultExact?: boolean
}

export function NavLinks({
  links,
  orientation = 'horizontal',
  onLinkClick,
  defaultExact = false,
}: NavLinksProps) {
  const isVertical = orientation === 'vertical'

  return (
    <ul
      className={`nav-links ${isVertical ? 'nav-links-vertical' : 'nav-links-horizontal'}`}
    >
      {links.map(link => (
        <li key={link.to} className='nav-item'>
          <Link
            to={link.to}
            preload='intent'
            activeOptions={{ exact: link.exact ?? defaultExact }}
            className='nav-link'
            onClick={onLinkClick}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
