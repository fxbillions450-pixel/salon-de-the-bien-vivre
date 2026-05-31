import { describe, it, expect } from 'vitest'
import { verifyTurnstile } from '../turnstile'

describe('verifyTurnstile', () => {
  it('returns true for test token', async () => {
    const result = await verifyTurnstile('1x00000000000000000000AA')
    expect(result).toBe(true)
  })

  it('returns true when TURNSTILE_SECRET_KEY not set', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    const result = await verifyTurnstile('any-token')
    expect(result).toBe(true)
  })

  it('returns true for test-token', async () => {
    const result = await verifyTurnstile('test-token')
    expect(result).toBe(true)
  })
})
