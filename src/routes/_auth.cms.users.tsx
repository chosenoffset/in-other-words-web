import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useSuperadminDeleteUserAttempts } from '@/hooks/useSuperadminUsers'
import { Button } from '@/components/ui'

export const Route = createFileRoute('/_auth/cms/users')({
  component: CmsUsers,
})

function CmsUsers() {
  const [userId, setUserId] = useState('')
  const deleteAttempts = useSuperadminDeleteUserAttempts()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) {
      return
    }

    if (
      !confirm(
        `Are you sure you want to delete all puzzle attempts for user ${userId}? This action cannot be undone.`
      )
    ) {
      return
    }

    try {
      const result = await deleteAttempts.mutateAsync(userId)
      alert(
        `Successfully deleted ${result.deletedCount || 0} puzzle attempt(s) for user ${userId}`
      )
      setUserId('')
    } catch (error) {
      console.error('Failed to delete user attempts:', error)
      alert(
        'Failed to delete user attempts. Please check the console for details.'
      )
    }
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>User Management</h1>

      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>
          Delete User Puzzle Attempts
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          Remove all puzzle attempts for a specific user. This will permanently
          delete their attempt history.
        </p>

        <form onSubmit={handleDelete} className='flex flex-col gap-4 max-w-md'>
          <div>
            <label
              htmlFor='userId'
              className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'
            >
              User ID
            </label>
            <input
              id='userId'
              type='text'
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder='Enter Clerk user ID'
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
          </div>

          <Button
            type='submit'
            variant='submit'
            disabled={deleteAttempts.isPending || !userId.trim()}
          >
            {deleteAttempts.isPending ? 'Deleting...' : 'Delete All Attempts'}
          </Button>

          {deleteAttempts.isError && (
            <p className='text-red-600 dark:text-red-400 text-sm'>
              Error:{' '}
              {deleteAttempts.error?.message || 'Failed to delete attempts'}
            </p>
          )}
        </form>
      </section>
    </div>
  )
}
