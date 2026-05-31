import { describe, it, expect } from 'vitest'
import {
  contactFormSchema,
  newsletterSchema,
  reservationCreateSchema,
  privateEventInquirySchema,
  vendorApplicationSchema,
} from '../validations'

describe('contactFormSchema', () => {
  const validData = {
    name: 'Marie Dupont',
    email: 'marie@example.com',
    category: 'general' as const,
    message: 'Bonjour, je voudrais plus d\'informations sur vos services.',
    turnstileToken: 'test-token',
  }

  it('accepts valid data', () => {
    expect(contactFormSchema.safeParse(validData).success).toBe(true)
  })

  it('rejects missing email', () => {
    const { email: _e, ...bad } = validData
    expect(contactFormSchema.safeParse(bad).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(contactFormSchema.safeParse({ ...validData, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects short message', () => {
    expect(contactFormSchema.safeParse({ ...validData, message: 'Hi' }).success).toBe(false)
  })

  it('rejects invalid category', () => {
    expect(contactFormSchema.safeParse({ ...validData, category: 'invalid' }).success).toBe(false)
  })

  it('rejects missing turnstile token', () => {
    expect(contactFormSchema.safeParse({ ...validData, turnstileToken: '' }).success).toBe(false)
  })
})

describe('newsletterSchema', () => {
  const validData = {
    email: 'test@example.com',
    consent: true as const,
    turnstileToken: 'test-token',
  }

  it('accepts valid data', () => {
    expect(newsletterSchema.safeParse(validData).success).toBe(true)
  })

  it('rejects missing consent', () => {
    expect(newsletterSchema.safeParse({ ...validData, consent: false }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(newsletterSchema.safeParse({ ...validData, email: 'bad' }).success).toBe(false)
  })
})

describe('reservationCreateSchema', () => {
  const validData = {
    experienceId: '550e8400-e29b-41d4-a716-446655440000',
    quantity: 2,
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie@example.com',
    phone: '5145551234',
    consentTerms: true as const,
    sourceId: 'cnon:test-source',
    turnstileToken: 'test-token',
  }

  it('accepts valid data', () => {
    expect(reservationCreateSchema.safeParse(validData).success).toBe(true)
  })

  it('rejects quantity 0', () => {
    expect(reservationCreateSchema.safeParse({ ...validData, quantity: 0 }).success).toBe(false)
  })

  it('rejects quantity > 10', () => {
    expect(reservationCreateSchema.safeParse({ ...validData, quantity: 11 }).success).toBe(false)
  })

  it('rejects invalid UUID', () => {
    expect(reservationCreateSchema.safeParse({ ...validData, experienceId: 'not-a-uuid' }).success).toBe(false)
  })

  it('requires consent', () => {
    expect(reservationCreateSchema.safeParse({ ...validData, consentTerms: false }).success).toBe(false)
  })
})

describe('vendorApplicationSchema', () => {
  const validData = {
    businessName: 'My Shop',
    contactName: 'Jane Doe',
    email: 'jane@shop.com',
    phone: '5145550000',
    productType: 'Art',
    preferredDate: '2025-06-01',
    consentTerms: true as const,
    turnstileToken: 'test-token',
  }

  it('accepts valid data', () => {
    expect(vendorApplicationSchema.safeParse(validData).success).toBe(true)
  })

  it('rejects short business name', () => {
    expect(vendorApplicationSchema.safeParse({ ...validData, businessName: 'X' }).success).toBe(false)
  })
})
