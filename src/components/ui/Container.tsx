import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const containerVariants = cva(
  "mx-auto px-4",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full"
      },
      background: {
        none: "",
        subtle: "bg-gradient-game",
        primary: "bg-gradient-primary",
        card: "bg-gradient-card"
      },
      padding: {
        none: "p-0",
        sm: "py-8",
        md: "py-14", // Current default
        lg: "py-20",
        xl: "py-32"
      }
    },
    defaultVariants: {
      size: "md",
      background: "none",
      padding: "md"
    }
  }
)

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, background, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size, background, padding }), className)}
      {...props}
    />
  )
)
Container.displayName = "Container"

export { Container, containerVariants }
export type { ContainerProps }