import { cva } from 'class-variance-authority'

export const containerVariants = cva('mx-auto px-4', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
    background: {
      none: '',
      subtle: 'bg-gradient-game',
      primary: 'bg-gradient-primary',
      card: 'bg-gradient-card',
    },
    padding: {
      none: 'p-0',
      sm: 'py-8',
      md: 'py-14', // Current default
      lg: 'py-20',
      xl: 'py-32',
    },
  },
  defaultVariants: {
    size: 'md',
    background: 'none',
    padding: 'md',
  },
})
