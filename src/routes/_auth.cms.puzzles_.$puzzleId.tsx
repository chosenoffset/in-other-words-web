import { useEffect, useMemo, useState } from 'react'
import {
  createFileRoute,
  useNavigate,
  useParams,
  Link,
} from '@tanstack/react-router'
import { Spinner } from '@/components/Spinner'
import {
  useSuperadminGetPuzzle,
  useSuperadminCreatePuzzle,
  useSuperadminUpdatePuzzle,
  useSuperadminHardDeletePuzzle,
} from '@/hooks/useSuperadminPuzzles'

export const Route = createFileRoute('/_auth/cms/puzzles_/$puzzleId')({
  component: PuzzleDetailPage,
})

type FormState = {
  question: string
  answer: string
  hints: string[]
  archived: boolean
  published: boolean
}

function PuzzleDetailPage() {
  const { puzzleId } = useParams({ from: '/_auth/cms/puzzles_/$puzzleId' })
  const navigate = useNavigate()
  const isNew = puzzleId === 'new'

  const {
    data: existingPuzzle,
    isLoading,
    isError,
    error,
  } = useSuperadminGetPuzzle(isNew ? '' : puzzleId)

  const createMutation = useSuperadminCreatePuzzle()
  const updateMutation = useSuperadminUpdatePuzzle()
  const hardDelete = useSuperadminHardDeletePuzzle()

  const initialValues: FormState = useMemo(() => {
    if (!isNew && existingPuzzle) {
      return {
        question: existingPuzzle.question || '',
        answer: existingPuzzle.answer || '',
        hints: existingPuzzle.hints || [],
        archived: existingPuzzle.archived || false,
        published: existingPuzzle.published || false,
      }
    }
    return {
      question: '',
      answer: '',
      hints: [],
      archived: false,
      published: false,
    }
  }, [existingPuzzle, isNew])

  const [formState, setFormState] = useState<FormState>(initialValues)
  useEffect(() => {
    setFormState(initialValues)
  }, [initialValues])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormState(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isNew) {
      const payload = {
        question: formState.question,
        answer: formState.answer,
        hints: formState.hints,
        archived: formState.archived,
        published: formState.published,
        category: 'UNCATEGORIZED' as const,
      }

      createMutation.mutate(payload, {
        onSuccess: () => navigate({ to: '/cms/puzzles' }),
      })
      return
    }

    if (existingPuzzle) {
      const updatePayload = {
        ...existingPuzzle,
        question: formState.question,
        answer: formState.answer,
        hints: formState.hints,
        archived: formState.archived,
        published: formState.published,
      }

      updateMutation.mutate(updatePayload, {
        onSuccess: () => navigate({ to: '/cms/puzzles' }),
      })
    }
  }

  if (!isNew && isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '20vh' }}>
        <Spinner aria-label='Loading puzzle' />
      </div>
    )
  }

  if (!isNew && isError) {
    return (
      <div>
        <p className='error-message'>Failed to load puzzle</p>
        <pre className='muted'>
          {String((error as Error)?.message || 'Unknown error')}
        </pre>
        <Link to='/cms/puzzles' className='nav-link'>
          Back to Puzzles
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '100%', width: '100%', padding: '0 20px' }}>
      <div
        className='flex-container'
        style={{ justifyContent: 'space-between', marginBottom: 24 }}
      >
        <h1 style={{ margin: 0 }}>{isNew ? 'Create Puzzle' : 'Edit Puzzle'}</h1>
        <Link to='/cms/puzzles' className='nav-link'>
          Back to Puzzles
        </Link>
      </div>

      <form onSubmit={handleSubmit} className='shell' style={{ padding: 24 }}>
        <div className='input-group' style={{ marginBottom: 24 }}>
          <label className='answer-label' htmlFor='question-input' style={{ marginBottom: 8, display: 'block' }}>
            Question
          </label>
          <textarea
            id='question-input'
            className='answer-input'
            name='question'
            value={formState.question}
            onChange={handleChange}
            required
            rows={3}
            style={{ padding: '12px', resize: 'vertical', minHeight: '80px', width: '100%' }}
          />
        </div>

        <div className='input-group' style={{ marginBottom: 24 }}>
          <label className='answer-label' htmlFor='answer-input' style={{ marginBottom: 8, display: 'block' }}>
            Answer
          </label>
          <input
            id='answer-input'
            className='answer-input mono'
            name='answer'
            value={formState.answer}
            onChange={handleChange}
            required
            style={{ padding: '12px', width: '100%' }}
          />
        </div>

        <div className='input-group' style={{ marginBottom: 24 }}>
          <h3 className='answer-label' style={{ marginBottom: 12 }}>Hints</h3>
          <div
            className='flex-container'
            style={{ flexDirection: 'column', gap: 16 }}
          >
            {formState.hints.map((hint, index) => (
              <div key={index} className='flex-container' style={{ gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    className='answer-input'
                    value={hint}
                    onChange={e => {
                      const value = e.target.value
                      setFormState(prev => {
                        const next = [...prev.hints]
                        next[index] = value
                        return { ...prev, hints: next }
                      })
                    }}
                    placeholder={`Hint ${index + 1}`}
                    rows={2}
                    style={{ padding: '12px', resize: 'vertical', width: '100%' }}
                  />
                </div>
                <button
                  type='button'
                  className='retry-button'
                  onClick={() =>
                    setFormState(prev => ({
                      ...prev,
                      hints: prev.hints.filter((_, i) => i !== index),
                    }))
                  }
                  style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type='button'
              className='retry-button'
              onClick={() =>
                setFormState(prev => ({ ...prev, hints: [...prev.hints, ''] }))
              }
              style={{ padding: '10px 20px', alignSelf: 'flex-start' }}
            >
              Add hint
            </button>
          </div>
        </div>

        <div
          className='flex-container'
          style={{ marginTop: 24, justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div className='flex-container' style={{ gap: 24, flexWrap: 'wrap' }}>
            <label
              className='answer-label'
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              <input
                type='checkbox'
                name='published'
                checked={formState.published}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              Published
            </label>
            <label
              className='answer-label'
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              <input
                type='checkbox'
                name='archived'
                checked={formState.archived}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              Archived
            </label>
          </div>
          <button
            type='submit'
            className='submit-button'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isNew
              ? createMutation.isPending
                ? 'Creating…'
                : 'Create Puzzle'
              : updateMutation.isPending
                ? 'Saving…'
                : 'Save Changes'}
          </button>
        </div>
      </form>

      {!isNew && (
        <div className='shell' style={{ padding: 24, marginTop: 24 }}>
          <div
            className='flex-container'
            style={{ gap: 16, justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <h3 style={{ margin: 0, marginBottom: 4 }}>Danger Zone</h3>
              <p className='muted' style={{ margin: 0 }}>Permanently delete this puzzle. This action cannot be undone.</p>
            </div>
            <button
              type='button'
              className='danger-button'
              onClick={() =>
                existingPuzzle &&
                hardDelete.mutate(existingPuzzle.id, {
                  onSuccess: () => navigate({ to: '/cms/puzzles' }),
                })
              }
              disabled={hardDelete.isPending}
              title='HARD DELETE – cannot be undone'
            >
              {hardDelete.isPending ? 'Deleting…' : 'Delete Puzzle'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
