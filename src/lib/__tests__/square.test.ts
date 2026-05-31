import { describe, it, expect, vi } from 'vitest'
import { verifySquareWebhookSignature } from '../square'

describe('verifySquareWebhookSignature', () => {
  it('returns false when SQUARE_WEBHOOK_SIGNATURE_KEY is not set', () => {
    delete process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
    const result = verifySquareWebhookSignature({
      body: '{}',
      signature: 'test',
      webhookUrl: 'https://example.com/api/webhooks/square',
    })
    expect(result).toBe(false)
  })

  it('returns false for wrong signature', () => {
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = 'test-key'
    const result = verifySquareWebhookSignature({
      body: '{"event_id":"123"}',
      signature: 'wrong-signature',
      webhookUrl: 'https://example.com/api/webhooks/square',
    })
    expect(result).toBe(false)
    delete process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  })

  it('returns true for correct signature', () => {
    const key = 'test-webhook-key'
    const url = 'https://example.com/api/webhooks/square'
    const body = '{"event_id":"test-123"}'

    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(url + body)
    const correctSig = hmac.digest('base64')

    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = key
    const result = verifySquareWebhookSignature({ body, signature: correctSig, webhookUrl: url })
    expect(result).toBe(true)
    delete process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  })
})
