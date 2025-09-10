import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/cms/')({
  component: CmsOverview,
})

function CmsOverview() {
  return (
    <div>
      <h1 style={{ margin: 0 }}>CMS Overview</h1>
      <p className='muted' style={{ marginTop: 8 }}>
        Choose a section from the left to get started.
      </p>
    </div>
  )
}
