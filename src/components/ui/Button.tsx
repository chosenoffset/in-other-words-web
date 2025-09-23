import React, { useState, useRef } from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button-variants'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animation?: 'none' | 'pulse' | 'glow'
  ripple?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation: _animation,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ripple = true,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const [ripples, setRipples] = useState<
      Array<{ id: number; x: number; y: number; size: number }>
    >([])
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
        size,
      }

      setRipples(prev => [...prev, newRipple])

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }

    if (asChild) {
      // When asChild is true, apply styles to the child element
      const child = React.Children.only(children) as React.ReactElement
      return React.cloneElement(child, {
        className: cn(
          buttonVariants({ variant, size }),
          (child.props as React.HTMLAttributes<HTMLElement>)?.className,
          className
        ),
        ...props,
      } as React.HTMLAttributes<HTMLElement>)
    }

    return (
      <button
        ref={node => {
          buttonRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        onMouseDown={createRipple}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className='absolute rounded-full bg-white/30 pointer-events-none animate-ping'
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              animationDuration: '600ms',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}

        {/* Button content */}
        <span className='relative z-10 flex items-center justify-center'>
          {loading && (
            <svg
              className='animate-spin -ml-1 mr-2 h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          )}
          {!loading && leftIcon && <span className='mr-2'>{leftIcon}</span>}
          {children}
          {!loading && rightIcon && <span className='ml-2'>{rightIcon}</span>}
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
