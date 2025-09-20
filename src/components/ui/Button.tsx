import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes for all buttons
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background border",
  {
    variants: {
      variant: {
        // Maps to .primary-button
        primary: "border-sky-500 bg-sky-500 text-white shadow-lg hover:bg-sky-600 hover:border-sky-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/35 active:translate-y-0 active:shadow-lg active:shadow-sky-500/25 disabled:opacity-60",

        // Maps to .secondary-button
        secondary: "bg-background text-foreground border-border hover:bg-card disabled:opacity-50",

        // Maps to .danger-button
        destructive: "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed",

        // Maps to .give-up-button
        ghost: "bg-transparent text-slate-500 border-border hover:text-red-600 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed",

        // Maps to .signin-button (same as primary but can be customized)
        signin: "border-sky-500 bg-sky-500 text-white hover:bg-sky-600 hover:border-sky-600",

        // Maps to .submit-button
        submit: "border-sky-500 bg-sky-500 text-white hover:bg-sky-600 hover:border-sky-600 disabled:bg-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed text-base font-medium",

        // Maps to .retry-button
        retry: "border-sky-500 bg-sky-500 text-white hover:bg-sky-600 hover:border-sky-600 text-sm",

        // Maps to .hint-reveal-button
        hint: "border-sky-500 bg-sky-500 text-white hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-slate-500 disabled:cursor-not-allowed",
      },
      size: {
        sm: "h-9 px-3 py-2 text-sm", // 8px 12px equivalent
        md: "h-10 px-4 py-2",        // 8px 16px equivalent
        lg: "h-11 px-8 py-3",        // 12px 24px equivalent
        xl: "h-12 px-6 py-3 text-base", // 12px 16px equivalent
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    if (asChild) {
      // When asChild is true, apply styles to the child element
      const child = React.Children.only(children) as React.ReactElement;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size }), (child.props as any)?.className, className),
        ...props,
      } as any);
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }