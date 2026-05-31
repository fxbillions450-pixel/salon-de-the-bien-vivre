import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/square', () => ({
  verifySquareWebhookSignature: vi.fn().mockReturnValue(true),
  getSquareClient: vi.fn(),
  createSquarePayment: vi.fn(),
}))

vi.mock('@/lib/email', () => ({
  sendReservationConfirmedEmail: vi.fn().mockResolvedValue({}),
  sendAdminNotificationEmail: vi.fn().mockResolvedValue({}),
}))

const mockSingle = vi.fn()
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) })
const mockInsert = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/server', () => ({
  createAdminSupabaseClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSingle }) }),
      insert: mockInsert,
      update: mockUpdate,
    }),
  }),
}))

const { POST } = await import('../../../app/api/webhooks/square/route')

describe('POST /api/webhooks/square', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } })
    mockInsert.mockResolvedValue({ error: null })
  })

  function makeRequest(body: string, sig = 'valid-sig') {
    return new NextRequest('http://localhost/api/webhooks/square', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-square-hmacsha256-signature': sig,
      },
      body,
    })
  }

  it('returns 401 for invalid signature', async () => {
    const { verifySquareWebhookSignature } = await import('@/lib/square')
    vi.mocked(verifySquareWebhookSignature).mockReturnValueOnce(false)
    const res = await POST(makeRequest('{"event_id":"test"}'))
    expect(res.status).toBe(401)
  })

  it('returns 200 for valid event', async () => {
    const body = JSON.stringify({ event_id: 'ev-123', type: 'payment.created' })
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(200)
  })

  it('returns 200 for already processed event (idempotency)', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null })
    const body = JSON.stringify({ event_id: 'ev-already-processed', type: 'payment.created' })
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.message).toBe('Already processed.')
  })
})
