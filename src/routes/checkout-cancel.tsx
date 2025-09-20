import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { Spinner } from '@/components/Spinner'
import { useGetTransaction } from '@/hooks/useTransaction'
import { Button, Container } from '@/components/ui'

export const Route = createFileRoute('/checkout-cancel')({
  component: CheckoutCancelPage,
})

function CheckoutCancelPage() {
  const { transactionId } = useSearch({
    from: '/checkout-cancel',
    select: d => d as { transactionId?: string },
  })
  const { data: transaction, isLoading } = useGetTransaction(transactionId)

  return (
    <main>
      <Container className="py-14">
        <section className='checkout-result cancel'>
        <header className='checkout-header'>
          <div className='checkout-icon'>🛑</div>
          <div>
            <h1 className='checkout-title'>Checkout Canceled</h1>
            <p className='checkout-subtitle'>
              No charge was made. You can try again anytime.
            </p>
          </div>
        </header>

        {isLoading && (
          <div
            style={{ display: 'grid', placeItems: 'center', minHeight: '10vh' }}
          >
            <Spinner aria-label='Loading transaction' />
          </div>
        )}

        {transaction && (
          <div className='checkout-details'>
            <div className='details-row'>
              <span className='details-label'>Transaction ID</span>
              <span className='details-value mono'>{transaction.id}</span>
            </div>
            <div className='details-row'>
              <span className='details-label'>Status</span>
              <span className='details-value'>Canceled</span>
            </div>
          </div>
        )}

        {!isLoading && !transaction && (
          <p className='checkout-note muted'>
            We couldn&apos;t load your transaction details.
          </p>
        )}

        <div className='checkout-actions'>
          <Button asChild variant="secondary">
            <Link to='/'>
              Return Home
            </Link>
          </Button>
          <Button asChild variant="primary">
            <Link to='/profile'>
              Go to Profile
            </Link>
          </Button>
        </div>
      </section>
      </Container>
    </main>
  )
}
