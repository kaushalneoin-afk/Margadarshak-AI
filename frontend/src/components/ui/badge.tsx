import { cn } from '@/lib/utils'

const badgeVariants = {
  default: 'bg-white/10 text-white border-white/20',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  outline: 'bg-transparent text-white/60 border-white/20',
}

export function Badge({
  className,
  variant = 'default',
  children,
}: {
  className?: string
  variant?: keyof typeof badgeVariants
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        'backdrop-blur-sm',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
