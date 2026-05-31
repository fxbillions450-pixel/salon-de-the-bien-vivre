import { SquareClient, SquareEnvironment } from 'square'
import { randomUUID } from 'crypto'

export function getSquareClient() {
  const environment = process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox

  return new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment,
  })
}

export async function createSquarePayment({
  sourceId,
  amountCents,
  currency = 'CAD',
  idempotencyKey = randomUUID(),
  note,
  referenceId,
}: {
  sourceId: string
  amountCents: number
  currency?: string
  idempotencyKey?: string
  note?: string
  referenceId?: string
}) {
  const client = getSquareClient()
  const result = await client.payments.create({
    sourceId,
    idempotencyKey,
    amountMoney: {
      amount: BigInt(amountCents),
      currency: currency as 'CAD' | 'USD',
    },
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    note,
    referenceId,
  })
  return result.payment
}

export function verifySquareWebhookSignature({
  body,
  signature,
  webhookUrl,
}: {
  body: string
  signature: string
  webhookUrl: string
}): boolean {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  if (!signatureKey) return false

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto') as typeof import('crypto')
  const hmac = crypto.createHmac('sha256', signatureKey)
  hmac.update(webhookUrl + body)
  const expected = hmac.digest('base64')
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}
