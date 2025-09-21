import React, { useState, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Enhanced base classes with improved animations and micro-interactions
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background border relative overflow-hidden group interactive-button animate-gpu",
  {
    variants: {
      variant: {
        // Enhanced existing variants with gradient and animation effects
        primary: "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-sky-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-400 before:to-blue-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity",

        secondary: "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md transition-all duration-300",

        destructive: "border-red-600 bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5",

        ghost: "bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:text-red-600 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-all duration-300",

        signin: "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5",

        submit: "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 disabled:bg-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed text-base font-medium",

        retry: "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 text-sm",

        hint: "border-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-slate-500 disabled:cursor-not-allowed",

        // New enhanced game-specific variants
        "game-primary": "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:scale-105 active:scale-100 transition-all duration-300",

        "hint-reveal": "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300",

        "success": "bg-gradient-success text-white hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 animate-success-bounce",

        "floating": "bg-gradient-primary text-white shadow-xl animate-float hover:animate-glow",
      },

      size: {
        sm: "h-9 px-3 py-2 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 py-3",
        xl: "h-12 px-6 py-3 text-base",
        "game": "h-12 px-8 py-3 text-lg font-semibold" // New game-specific size
      },

      animation: {
        none: "",
        pulse: "animate-pulse-game",
        bounce: "animate-bounce-subtle",
        glow: "animate-glow"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      animation: "none"
    }
  }
)

// Add animation prop to interface
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animation?: "none" | "pulse" | "bounce" | "glow"
  ripple?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, loading, leftIcon, rightIcon, children, disabled, ripple = true, ...props }, ref) => {
    const isDisabled = disabled || loading
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])
    const buttonRef = useRef<HTMLButtonElement>(null)

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || isDisabled) return

      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple = {
        id: Date.now() + Math.random(),
        x,
        y,
        size
      }

      setRipples(prev => [...prev, newRipple])

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }

    if (asChild) {
      // When asChild is true, apply styles to the child element
      const child = React.Children.only(children) as React.ReactElement;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size, animation }), (child.props as any)?.className, className),
        ...props,
      } as any);
    }

    return (
      <button
        ref={(node) => {
          buttonRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(buttonVariants({ variant, size, animation, className }))}
        disabled={isDisabled}
        onMouseDown={createRipple}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              animationDuration: '600ms',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        ))}

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center">
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
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }