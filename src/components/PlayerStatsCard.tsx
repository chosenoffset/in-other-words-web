import { useGetPlayerStats } from '@/hooks/usePuzzles'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from './Spinner'
import { SubscribeButton } from '@/components/SubscribeButton'
import { useGetCurrentUser } from '@/hooks/useUser'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'

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
    <Card className="shadow-sm">
      <SignedOut>
        <CardContent className="text-center py-8">
          <CardTitle className="mb-3">Track Your Progress</CardTitle>
          <p className="text-muted mb-5 leading-relaxed">
            Sign in to track your puzzle-solving statistics and see your
            progress over time.
          </p>
          <Button asChild variant="signin">
            <Link to='/sign-in'>
              Sign In
            </Link>
          </Button>
        </CardContent>
      </SignedOut>

      <SignedIn>
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
        </CardHeader>
        <CardContent>

          {isLoading && <Spinner aria-label='Loading statistics' />}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Failed to load statistics. Please try again later.</p>
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Basic Stats */}
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">{stats.totalGames}</div>
                <div className="text-sm text-muted">Total Games</div>
              </div>

              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">{stats.gamesWon}</div>
                <div className="text-sm text-muted">Games Won</div>
              </div>

              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">{stats.winRate.toFixed(1)}%</div>
                <div className="text-sm text-muted">Win Rate</div>
              </div>

              {(() => {
                const hasActive = appUser?.stripeSubscriptions?.some(
                  s => s.status === 'ACTIVE'
                )
                const gatedBox = (
                  <div className="col-span-full relative p-4 bg-background border border-border rounded-lg">
                    <div className="blur-sm">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">???</div>
                          <div className="text-sm text-muted">Current Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">???</div>
                          <div className="text-sm text-muted">Best Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">???</div>
                          <div className="text-sm text-muted">Avg Guesses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">???</div>
                          <div className="text-sm text-muted">Avg Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-1">???</div>
                          <div className="text-sm text-muted">Best Time</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/90 rounded-lg">
                      <p className="text-muted mb-4">
                        Unlock streaks and times with a subscription.
                      </p>
                      <SubscribeButton />
                    </div>
                  </div>
                )
                if (!hasActive) return gatedBox
                return (
                  <>
                    <div className="text-center p-4 bg-background border border-border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">{stats.currentStreak}</div>
                      <div className="text-sm text-muted">Current Streak</div>
                    </div>
                    <div className="text-center p-4 bg-background border border-border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">{stats.longestStreak}</div>
                      <div className="text-sm text-muted">Best Streak</div>
                    </div>
                    <div className="text-center p-4 bg-background border border-border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stats.averageGuesses?.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted">Avg Guesses</div>
                    </div>
                    <div className="text-center p-4 bg-background border border-border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {formatTime(stats.averageSolveTimeMs ?? null)}
                      </div>
                      <div className="text-sm text-muted">Avg Time</div>
                    </div>
                    <div className="text-center p-4 bg-background border border-border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {formatTime(stats.fastestSolveMs ?? null)}
                      </div>
                      <div className="text-sm text-muted">Best Time</div>
                    </div>
                  </>
                )
              })()}

              {/* Last Played - spans full width */}
              <div className="col-span-full text-center p-4 bg-background border border-border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatDate(stats.lastPlayedAt ?? null)}
                </div>
                <div className="text-sm text-muted">Last Played</div>
              </div>
            </div>
          )}
        </CardContent>
      </SignedIn>
    </Card>
  )
}
