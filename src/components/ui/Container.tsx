import React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { containerVariants } from './container-variants'

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, background, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        containerVariants({ size, background, padding }),
        className
      )}
      {...props}
    />
  )
)
Container.displayName = 'Container'

export { Container }
export type { ContainerProps }
