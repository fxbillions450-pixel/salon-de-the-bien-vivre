import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/ratelimit', () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true, limit: 5, remaining: 4 }),
}))

vi.mock('@/lib/turnstile', () => ({
  verifyTurnstile: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/email', () => ({
  sendContactConfirmationEmail: vi.fn().mockResolvedValue({}),
  sendAdminNotificationEmail: vi.fn().mockResolvedValue({}),
}))

const mockInsert = vi.fn().mockResolvedValue({ error: null })
vi.mock('@/lib/supabase/server', () => ({
  createAdminSupabaseClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({ insert: mockInsert }),
  }),
}))

const { POST } = await import('../../../app/api/contact/route')

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
  })

  function makeRequest(body: unknown) {
    return new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify(body),
    })
  }

  const validBody = {
    name: 'Test User',
    email: 'test@example.com',
    category: 'general',
    message: 'Bonjour, ceci est un test de message valide.',
    turnstileToken: 'test-token',
  }

  it('returns 200 for valid submission', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 400 for missing email', async () => {
    const { email: _e, ...bad } = validBody
    const res = await POST(makeRequest(bad))
    expect(res.status).toBe(400)
  })

  it('returns 400 for short message', async () => {
    const res = await POST(makeRequest({ ...validBody, message: 'Hi' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid category', async () => {
    const res = await POST(makeRequest({ ...validBody, category: 'invalid' }))
    expect(res.status).toBe(400)
  })

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = await import('@/lib/ratelimit')
    vi.mocked(rateLimit).mockResolvedValueOnce({ success: false, limit: 5, remaining: 0 })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(429)
  })

  it('returns 400 when turnstile fails', async () => {
    const { verifyTurnstile } = await import('@/lib/turnstile')
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false)
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
