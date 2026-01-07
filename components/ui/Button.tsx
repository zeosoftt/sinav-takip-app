import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-glow active:scale-95': variant === 'default',
            'border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-dark-text hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95': variant === 'outline',
            'text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-dark-surface active:scale-95': variant === 'ghost',
            'h-8 px-3 text-sm font-mono': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
