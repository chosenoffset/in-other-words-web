import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useSuperadminGetPuzzles,
  useSuperadminSoftDeletePuzzle,
} from '@/hooks/useSuperadminPuzzles'
import { Spinner } from '@/components/Spinner'

export const Route = createFileRoute('/_auth/cms/puzzles')({
  component: PuzzlesList,
})

function PuzzlesList() {
  const { data, isLoading, isError, error, refetch } = useSuperadminGetPuzzles()
  const softDelete = useSuperadminSoftDeletePuzzle()

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '20vh' }}>
        <Spinner aria-label='Loading puzzles' />
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <p className='error-message'>Failed to load puzzles</p>
        <pre className='muted' aria-live='polite'>
          {String((error as Error)?.message || 'Unknown error')}
        </pre>
        <button className='retry-button' onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  }

  const puzzles = data ?? []

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <div
          className='flex-container'
          style={{ justifyContent: 'space-between' }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Puzzles</h1>
            <p className='muted' style={{ marginTop: 8 }}>
              {puzzles.length} item{puzzles.length === 1 ? '' : 's'}
            </p>
          </div>
          <Link
            to='/cms/puzzles/$puzzleId'
            params={{ puzzleId: 'new' }}
            className='submit-button'
          >
            Add puzzle
          </Link>
        </div>
      </header>

      <div className='table-container'>
        <table className='table' role='table'>
          <thead>
            <tr>
              <th scope='col'>Question</th>
              <th scope='col'>Answer</th>
              <th scope='col'>Published</th>
              <th scope='col'>Archived</th>
              <th scope='col'>Created</th>
              <th scope='col'>Updated</th>
              <th scope='col' style={{ width: 1 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {puzzles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  No puzzles found
                </td>
              </tr>
            ) : (
              puzzles.map(p => (
                <tr key={p.id} className='table-row'>
                  <td>
                    <Link
                      to='/cms/puzzles/$puzzleId'
                      params={{ puzzleId: p.id }}
                    >
                      {p.question}
                    </Link>
                  </td>
                  <td className='mono'>{p.answer}</td>
                  <td>{p.published ? 'Yes' : 'No'}</td>
                  <td>{p.archived ? 'Yes' : 'No'}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>{new Date(p.updatedAt).toLocaleString()}</td>
                  <td>
                    {!p.archived && (
                      <button
                        className='danger-button'
                        onClick={() => softDelete.mutate(p.id)}
                        disabled={softDelete.isPending}
                        title='Archive puzzle'
                      >
                        {softDelete.isPending ? 'Archiving…' : 'Archive'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
