import { Outlet, createFileRoute } from '@tanstack/react-router'
import { CmsNav } from '@/components/CmsNav'

export const Route = createFileRoute('/_auth/cms')({
  component: CmsLayout,
})

function CmsLayout() {
  return (
    <main className='container'>
      <div className='cms-layout'>
        <CmsNav />
        <section className='cms-main'>
          <Outlet />
        </section>
      </div>
    </main>
  )
}
