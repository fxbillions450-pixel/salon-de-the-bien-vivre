import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amountCents: number, locale = 'fr-CA', currency = 'CAD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amountCents / 100)
}

export function formatDate(dateString: string, locale = 'fr-CA') {
  return new Date(dateString).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(dateString: string, locale = 'fr-CA') {
  return new Date(dateString).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getSpotsRemaining(capacity: number, spotsReserved: number, spotsConfirmed: number) {
  return Math.max(0, capacity - spotsReserved - spotsConfirmed)
}

export function isExperienceSoldOut(capacity: number, spotsReserved: number, spotsConfirmed: number) {
  return getSpotsRemaining(capacity, spotsReserved, spotsConfirmed) <= 0
}
