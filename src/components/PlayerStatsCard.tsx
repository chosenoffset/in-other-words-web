import { useGetPlayerStats } from '@/hooks/usePuzzles'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from './Spinner'
import { SubscribeButton } from '@/components/SubscribeButton'
import { useGetCurrentUser } from '@/hooks/useUser'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/components/ui'
import { useEffect, useState } from 'react'

// Animated counter hook
const useAnimatedCounter = (value: number, duration: number = 1000) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = current
    const targetValue = value

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const newValue = Math.round(
        startValue + (targetValue - startValue) * easeOut
      )

      setCurrent(newValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    if (value !== current) {
      requestAnimationFrame(animate)
    }
  }, [value, duration, current])

  return current
}

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

  // Enhanced stat box component
  const StatBox = ({
    value,
    label,
    icon,
    isAnimated = true,
    delay = 0,
    variant = 'default',
  }: {
    value: string | number
    label: string
    icon?: React.ReactNode
    isAnimated?: boolean
    delay?: number
    variant?: 'default' | 'success' | 'primary' | 'warning'
  }) => {
    const numericValue =
      typeof value === 'number'
        ? value
        : parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0
    const animatedValue = useAnimatedCounter(
      isAnimated ? numericValue : numericValue,
      1200
    )
    const displayValue = typeof value === 'number' ? animatedValue : value

    const variantStyles = {
      default:
        'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 border-slate-200 dark:border-slate-700',
      success:
        'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-700',
      primary:
        'bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-700',
      warning:
        'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700',
    }

    const textStyles = {
      default: 'text-slate-800 dark:text-slate-200',
      success: 'text-emerald-800 dark:text-emerald-200',
      primary: 'text-sky-800 dark:text-sky-200',
      warning: 'text-amber-800 dark:text-amber-200',
    }

    return (
      <div
        className={`
          text-center p-6 border rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1
          animate-fade-in group cursor-default
          ${variantStyles[variant]}
        `}
        style={{ animationDelay: `${delay}ms` }}
      >
        {icon && (
          <div className='flex justify-center mb-2'>
            <div className='w-8 h-8 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300'>
              {icon}
            </div>
          </div>
        )}
        <div
          className={`text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300 ${textStyles[variant]}`}
        >
          {isAnimated && typeof value === 'number'
            ? animatedValue
            : displayValue}
        </div>
        <div className='text-sm text-muted font-medium'>{label}</div>
      </div>
    )
  }

  return (
    <Card variant='stats' className='shadow-lg animate-fade-in'>
      <SignedOut>
        <CardContent className='text-center py-12'>
          <div className='w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='h-8 w-8 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
          </div>
          <CardTitle className='mb-4 text-foreground'>
            <span className='bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent'>
              Track Your Progress
            </span>
          </CardTitle>
          <p className='text-muted mb-6 leading-relaxed max-w-md mx-auto'>
            Sign in to track your puzzle-solving statistics and see your
            progress over time.
          </p>
          <Button asChild variant='game-primary' size='lg'>
            <Link to='/sign-in'>
              <svg
                className='h-4 w-4 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                />
              </svg>
              Sign In
            </Link>
          </Button>
        </CardContent>
      </SignedOut>

      <SignedIn>
        <CardHeader>
          <CardTitle className='text-foreground flex items-center gap-3'>
            <svg
              className='h-6 w-6 text-sky-600 dark:text-sky-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            <span className='bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent'>
              Your Statistics
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <Spinner aria-label='Loading statistics' />}

          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-600'>
                Failed to load statistics. Please try again later.
              </p>
            </div>
          )}

          {stats && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Enhanced Basic Stats */}
              <StatBox
                value={stats.totalGames}
                label='Total Games'
                icon='🎮'
                delay={0}
                variant='primary'
              />

              <StatBox
                value={stats.gamesWon}
                label='Games Won'
                icon='🏆'
                delay={100}
                variant='success'
              />

              <StatBox
                value={`${stats.winRate.toFixed(1)}%`}
                label='Win Rate'
                icon='📊'
                delay={200}
                variant={
                  stats.winRate >= 70
                    ? 'success'
                    : stats.winRate >= 50
                      ? 'warning'
                      : 'default'
                }
                isAnimated={false}
              />

              {(() => {
                const hasActive = appUser?.stripeSubscriptions?.some(
                  s => s.status === 'ACTIVE'
                )
                const gatedBox = (
                  <div className='col-span-full relative'>
                    <div className='blur-sm'>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        <StatBox
                          value='???'
                          label='Current Streak'
                          icon='🔥'
                          variant='warning'
                          isAnimated={false}
                        />
                        <StatBox
                          value='???'
                          label='Best Streak'
                          icon='⭐'
                          variant='success'
                          isAnimated={false}
                        />
                        <StatBox
                          value='???'
                          label='Avg Guesses'
                          icon='🎯'
                          variant='primary'
                          isAnimated={false}
                        />
                        <StatBox
                          value='???'
                          label='Avg Time'
                          icon='⏱️'
                          variant='default'
                          isAnimated={false}
                        />
                        <StatBox
                          value='???'
                          label='Best Time'
                          icon='⚡'
                          variant='warning'
                          isAnimated={false}
                        />
                      </div>
                    </div>
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 rounded-lg backdrop-blur-sm border border-border'>
                      <div className='w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4'>
                        <svg
                          className='h-6 w-6 text-white'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                      </div>
                      <p className='text-foreground font-semibold mb-2'>
                        Premium Statistics
                      </p>
                      <p className='text-muted mb-4 max-w-sm'>
                        Unlock detailed streaks and timing analytics with a
                        subscription.
                      </p>
                      <SubscribeButton />
                    </div>
                  </div>
                )

                if (!hasActive) return gatedBox

                return (
                  <>
                    <StatBox
                      value={
                        stats.currentStreak !== undefined &&
                        stats.currentStreak !== null
                          ? stats.currentStreak
                          : 0
                      }
                      label='Current Streak'
                      icon='🔥'
                      delay={300}
                      variant={
                        stats.currentStreak !== undefined &&
                        stats.currentStreak !== null &&
                        stats.currentStreak >= 5
                          ? 'warning'
                          : 'default'
                      }
                    />
                    <StatBox
                      value={
                        stats.longestStreak !== undefined &&
                        stats.longestStreak !== null
                          ? stats.longestStreak
                          : 0
                      }
                      label='Best Streak'
                      icon='⭐'
                      delay={400}
                      variant='success'
                    />
                    <StatBox
                      value={stats.averageGuesses?.toFixed(1) ?? 'N/A'}
                      label='Avg Guesses'
                      icon='🎯'
                      delay={500}
                      variant='primary'
                      isAnimated={false}
                    />
                    <StatBox
                      value={formatTime(stats.averageSolveTimeMs ?? null)}
                      label='Avg Time'
                      icon='⏱️'
                      delay={600}
                      variant='default'
                      isAnimated={false}
                    />
                    <StatBox
                      value={formatTime(stats.fastestSolveMs ?? null)}
                      label='Best Time'
                      icon='⚡'
                      delay={700}
                      variant='warning'
                      isAnimated={false}
                    />
                  </>
                )
              })()}

              {/* Enhanced Last Played */}
              <div className='col-span-full'>
                <StatBox
                  value={formatDate(stats.lastPlayedAt ?? null)}
                  label='Last Played'
                  icon='📅'
                  delay={800}
                  variant='default'
                  isAnimated={false}
                />
              </div>
            </div>
          )}
        </CardContent>
      </SignedIn>
    </Card>
  )
}
