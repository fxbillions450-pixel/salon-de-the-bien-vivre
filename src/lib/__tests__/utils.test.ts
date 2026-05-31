import { describe, it, expect } from 'vitest'
import { formatCurrency, getSpotsRemaining, isExperienceSoldOut, formatDate } from '../utils'

describe('formatCurrency', () => {
  it('formats 1500 cents as ~15.00 CAD', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('15')
    expect(result).toContain('$')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats large amounts', () => {
    const result = formatCurrency(100000)
    expect(result).toContain('1')
  })
})

describe('getSpotsRemaining', () => {
  it('calculates available spots correctly', () => {
    expect(getSpotsRemaining(10, 3, 2)).toBe(5)
  })

  it('returns 0 when fully booked', () => {
    expect(getSpotsRemaining(10, 5, 5)).toBe(0)
  })

  it('never goes below zero', () => {
    expect(getSpotsRemaining(5, 3, 4)).toBe(0)
  })

  it('returns full capacity when nothing reserved', () => {
    expect(getSpotsRemaining(20, 0, 0)).toBe(20)
  })
})

describe('isExperienceSoldOut', () => {
  it('returns true when capacity reached', () => {
    expect(isExperienceSoldOut(5, 3, 2)).toBe(true)
  })

  it('returns false when spots available', () => {
    expect(isExperienceSoldOut(10, 2, 2)).toBe(false)
  })

  it('returns true when overfull', () => {
    expect(isExperienceSoldOut(5, 4, 3)).toBe(true)
  })
})

describe('formatDate', () => {
  it('returns a formatted string', () => {
    const result = formatDate('2025-01-15T10:00:00Z')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})
