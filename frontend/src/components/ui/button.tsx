import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const variants = {
  default: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20',
  primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20',
  success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/20',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/20',
  ghost: 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10',
  outline: 'bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/30',
  glass: 'bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10',
}

const sizes = {
  xs: ' px-2.5 py-1 text-xs',
  sm: ' px-3 py-1.5 text-sm',
  md: ' px-4 py-2 text-sm',
  lg: ' px-6 py-3 text-base',
  xl: ' px-8 py-4 text-lg',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
