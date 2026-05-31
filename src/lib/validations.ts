import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  category: z.enum(['general', 'reservation', 'private_event', 'workshop', 'popup', 'media', 'other']),
  message: z.string().min(10).max(2000),
  turnstileToken: z.string().min(1),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  turnstileToken: z.string().min(1),
})

export const reservationCreateSchema = z.object({
  experienceId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  notes: z.string().max(500).optional(),
  consentTerms: z.literal(true),
  sourceId: z.string().min(1),
  turnstileToken: z.string().min(1),
})

export const privateEventInquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  eventType: z.string().min(1).max(100),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  guestCount: z.number().int().min(1).max(200),
  budgetRange: z.string().max(100).optional(),
  foodDrinkNeeds: z.string().max(500).optional(),
  message: z.string().max(2000).optional(),
  consentTerms: z.literal(true),
  turnstileToken: z.string().min(1),
})

export const vendorApplicationSchema = z.object({
  businessName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  instagram: z.string().max(100).optional(),
  productType: z.string().min(2).max(200),
  preferredDate: z.string().min(1),
  spaceNeeds: z.string().max(500).optional(),
  message: z.string().max(2000).optional(),
  consentTerms: z.literal(true),
  turnstileToken: z.string().min(1),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type NewsletterData = z.infer<typeof newsletterSchema>
export type ReservationCreateData = z.infer<typeof reservationCreateSchema>
export type PrivateEventInquiryData = z.infer<typeof privateEventInquirySchema>
export type VendorApplicationData = z.infer<typeof vendorApplicationSchema>
