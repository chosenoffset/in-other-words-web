import { NavLinks, type AppNavLink } from './NavLinks'

export function CmsNav() {
  const links: AppNavLink[] = [
    { to: '/cms', label: 'Overview', exact: true },
    { to: '/cms/puzzles', label: 'Puzzles' },
  ]

  return (
    <nav className='cms-sidenav' aria-label='CMS navigation'>
      <h2 className='cms-sidenav-title'>CMS</h2>
      <NavLinks links={links} orientation='vertical' defaultExact />
    </nav>
  )
}
