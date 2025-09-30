import { Outlet, createFileRoute } from '@tanstack/react-router'
import { CmsNav } from '@/components/CmsNav'
import { Container } from '@/components/ui'

export const Route = createFileRoute('/_auth/cms')({
  component: CmsLayout,
})

function CmsLayout() {
  return (
    <main className='min-h-[calc(100vh-70px)]'>
      <Container className='py-14'>
        <div className='cms-layout'>
          <CmsNav />
          <section className='cms-main'>
            <Outlet />
          </section>
        </div>
      </Container>
    </main>
  )
}
