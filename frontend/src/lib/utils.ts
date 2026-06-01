import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function formatSpeed(speed: number): string {
  return speed.toFixed(1) + ' km/h'
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%'
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#ff3355'
    case 'high': return '#ffaa00'
    case 'medium': return '#7c3aed'
    case 'low': return '#00ff88'
    default: return '#00f0ff'
  }
}

export function getCongestionColor(level: number): string {
  if (level < 0.25) return '#00ff88'
  if (level < 0.5) return '#00f0ff'
  if (level < 0.75) return '#ffaa00'
  return '#ff3355'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
