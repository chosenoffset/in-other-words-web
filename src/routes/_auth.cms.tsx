import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/cms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/cms"!</div>
}
