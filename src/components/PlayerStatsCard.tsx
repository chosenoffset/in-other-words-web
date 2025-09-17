import { useGetPlayerStats } from '@/hooks/usePuzzles'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from './Spinner'
import { SubscribeButton } from '@/components/SubscribeButton'
import { useGetCurrentUser } from '@/hooks/useUser'

export function PlayerStatsCard() {
  const { data: stats, isLoading, error } = useGetPlayerStats()
  const { data: appUser } = useGetCurrentUser()

  const formatTime = (timeMs: number | null) => {
    if (!timeMs) return 'N/A'
    const minutes = Math.floor(timeMs / 60000)
    const seconds = Math.floor((timeMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className='stats-card'>
      <SignedOut>
        <div className='stats-unauthenticated'>
          <h3>Track Your Progress</h3>
          <p>
            Sign in to track your puzzle-solving statistics and see your
            progress over time.
          </p>
          <Link to='/sign-in' className='signin-button'>
            Sign In
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className='stats-content'>
          <h3>Your Statistics</h3>

          {isLoading && <Spinner aria-label='Loading statistics' />}

          {error && (
            <div className='stats-error'>
              <p>Failed to load statistics. Please try again later.</p>
            </div>
          )}

          {stats && (
            <div className='stats-grid'>
              <div className='stat-item'>
                <div className='stat-value'>{stats.totalGames}</div>
                <div className='stat-label'>Total Games</div>
              </div>

              <div className='stat-item'>
                <div className='stat-value'>{stats.gamesWon}</div>
                <div className='stat-label'>Games Won</div>
              </div>

              <div className='stat-item'>
                <div className='stat-value'>{stats.winRate.toFixed(1)}%</div>
                <div className='stat-label'>Win Rate</div>
              </div>

              {(() => {
                const hasActive = appUser?.stripeSubscriptions?.some(
                  s => s.status === 'ACTIVE'
                )
                const gatedBox = (
                  <div className='stat-item stat-item-wide gated-stats'>
                    <div className='gated-stats-blur'>
                      <div className='gated-stats-grid'>
                        <div>
                          <div className='stat-value'>???</div>
                          <div className='stat-label'>Current Streak</div>
                        </div>
                        <div>
                          <div className='stat-value'>???</div>
                          <div className='stat-label'>Best Streak</div>
                        </div>
                        <div>
                          <div className='stat-value'>???</div>
                          <div className='stat-label'>Avg Guesses</div>
                        </div>
                        <div>
                          <div className='stat-value'>???</div>
                          <div className='stat-label'>Avg Time</div>
                        </div>
                        <div>
                          <div className='stat-value'>???</div>
                          <div className='stat-label'>Best Time</div>
                        </div>
                      </div>
                    </div>
                    <div className='gated-stats-overlay flow'>
                      <p className='muted'>
                        Unlock streaks and times with a subscription.
                      </p>
                      <SubscribeButton className='primary-button' />
                    </div>
                  </div>
                )
                if (!hasActive) return gatedBox
                return (
                  <>
                    <div className='stat-item'>
                      <div className='stat-value'>{stats.currentStreak}</div>
                      <div className='stat-label'>Current Streak</div>
                    </div>
                    <div className='stat-item'>
                      <div className='stat-value'>{stats.longestStreak}</div>
                      <div className='stat-label'>Best Streak</div>
                    </div>
                    <div className='stat-item'>
                      <div className='stat-value'>
                        {stats.averageGuesses?.toFixed(1)}
                      </div>
                      <div className='stat-label'>Avg Guesses</div>
                    </div>
                    <div className='stat-item'>
                      <div className='stat-value'>
                        {formatTime(stats.averageSolveTimeMs ?? null)}
                      </div>
                      <div className='stat-label'>Avg Time</div>
                    </div>
                    <div className='stat-item'>
                      <div className='stat-value'>
                        {formatTime(stats.fastestSolveMs ?? null)}
                      </div>
                      <div className='stat-label'>Best Time</div>
                    </div>
                  </>
                )
              })()}

              <div className='stat-item stat-item-wide'>
                <div className='stat-value'>
                  {formatDate(stats.lastPlayedAt ?? null)}
                </div>
                <div className='stat-label'>Last Played</div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  )
}
