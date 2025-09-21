import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { Spinner } from '@/components/Spinner'
import { useGetTransaction } from '@/hooks/useTransaction'
import { Button, Container } from '@/components/ui'

export const Route = createFileRoute('/checkout-success')({
  component: CheckoutSuccessPage,
})

function CheckoutSuccessPage() {
  const { transactionId } = useSearch({
    from: '/checkout-success',
    select: d => d as { transactionId?: string },
  })
  const { data: transaction, isLoading } = useGetTransaction(transactionId)

  return (
    <main>
      <Container className='py-14'>
        <section className='checkout-result success'>
          <header className='checkout-header'>
            <div className='checkout-icon'>✅</div>
            <div>
              <h1 className='checkout-title'>Payment Successful</h1>
              <p className='checkout-subtitle'>
                Thanks for your purchase! You&apos;re all set.
              </p>
            </div>
          </header>

          {isLoading && (
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: '10vh',
              }}
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
                <span className='details-value'>Completed</span>
              </div>
              <div className='details-row'>
                <span className='details-label'>Amount</span>
                <span className='details-value'>
                  {Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: transaction.currency,
                  }).format(transaction.amount / 100)}
                </span>
              </div>
            </div>
          )}

          {!isLoading && !transaction && (
            <p className='checkout-note muted'>
              We couldn&apos;t load your transaction details, but your payment
              was successful.
            </p>
          )}

          <div className='checkout-actions'>
            <Button asChild variant='primary'>
              <Link to='/'>Return Home</Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link to='/profile'>Go to Profile</Link>
            </Button>
          </div>
        </section>
      </Container>
    </main>
  )
}
