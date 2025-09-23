import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  // Enhanced base classes with improved animations and micro-interactions
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background border relative overflow-hidden group interactive-button animate-gpu cursor-pointer',
  {
    variants: {
      variant: {
        // Enhanced existing variants with gradient and animation effects
        primary:
          'border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-sky-500/25 active:translate-y-0 disabled:opacity-60 before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-400 before:to-blue-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity',

        secondary:
          'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md transition-all duration-300',

        destructive:
          'border-red-600 bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/25',

        ghost:
          'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:text-red-600 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300',

        signin:
          'border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25',

        submit:
          'border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 disabled:bg-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed text-base font-medium',

        retry:
          'border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 text-sm',

        hint: 'border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-slate-500 disabled:cursor-not-allowed',

        // New enhanced game-specific variants
        'game-primary':
          'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25 active:scale-100 transition-all duration-300',

        'hint-reveal':
          'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300',

        success:
          'bg-gradient-success text-white hover:shadow-lg hover:shadow-green-500/25 animate-success-bounce',

        floating:
          'bg-gradient-primary text-white shadow-xl animate-float hover:animate-glow',
      },

      size: {
        sm: 'h-9 px-3 py-2 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 py-3',
        xl: 'h-12 px-6 py-3 text-base',
        game: 'h-12 px-8 py-3 text-lg font-semibold', // New game-specific size
      },

      animation: {
        none: '',
        pulse: 'animate-pulse-game',
        glow: 'animate-glow',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      animation: 'none',
    },
  }
)
