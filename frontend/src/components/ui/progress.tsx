import { cn } from '@/lib/utils'

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  color,
}: {
  value: number
  max?: number
  className?: string
  barClassName?: string
  color?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div
      className={cn(
        'h-2 w-full rounded-full bg-white/10 overflow-hidden',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', barClassName)}
        style={{
          width: `${pct}%`,
          background: color || 'linear-gradient(90deg, #00f0ff, #0066ff)',
        }}
      />
    </div>
  )
}
