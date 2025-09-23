import { Link } from '@tanstack/react-router'
import { useUserContext } from '@/hooks/useUserContext'

export type AppNavLink = {
  to: string
  label: string
  exact?: boolean
  admin?: boolean
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
  const { isSuperAdmin } = useUserContext()

  const filteredLinks = links.filter(link => {
    if (link.admin) {
      return isSuperAdmin
    }
    return true
  })

  return (
    <ul
      className={`list-none m-0 p-0 ${isVertical ? 'grid gap-1.5 pt-2' : 'flex items-center gap-3.5'}`}
    >
      {filteredLinks.map(link => (
        <li key={link.to}>
          <Link
            to={link.to}
            preload='intent'
            activeOptions={{ exact: link.exact ?? defaultExact }}
            className='inline-flex items-center px-2.5 py-2 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors [&.active]:bg-blue-50 [&.active]:dark:bg-blue-900/30 [&.active]:text-blue-700 [&.active]:dark:text-blue-300'
            onClick={onLinkClick}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
