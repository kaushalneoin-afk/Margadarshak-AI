'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className,
}: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[]
  defaultTab?: string
  onChange?: (id: string) => void
  className?: string
}) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={cn('flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActive(tab.id)
            onChange?.(tab.id)
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            active === tab.id
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white shadow-sm border border-white/10'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
