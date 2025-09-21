import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-lg border bg-white text-slate-950 shadow-sm transition-all duration-300 interactive-card animate-gpu relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-border',
        game: 'border-border bg-gradient-card hover:shadow-xl hover:shadow-blue-500/5',
        stats:
          'border-border bg-gradient-to-br from-white to-gray-50 hover:shadow-lg animate-gpu-hover',
        hint: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg hover:shadow-indigo-500/10',
        floating: 'border-border shadow-xl animate-float',
        interactive:
          'border-border hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer animate-gpu-hover',
        premium:
          'border-gradient-to-r from-amber-200 to-orange-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl hover:shadow-amber-500/20',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)
