import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Salon de Thé Bien Vivre — Thé, bien-être & ateliers à Montréal',
    template: '%s | Salon de Thé Bien Vivre',
  },
  description:
    'Salon de thé, café-lounge et espace bien-être à Montréal. Thés, repas végétaliens, yoga, pilates, ateliers créatifs et plus.',
  keywords: [
    'salon de thé Montréal',
    'café lounge Montréal',
    'yoga café Montréal',
    'atelier peinture Montréal',
    'espace bien-être Montréal',
    'café végétalien Montréal',
    'Saint-Zotique',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: 'en_CA',
    siteName: 'Salon de Thé Bien Vivre',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`../../../i18n/messages/${locale}.json`)).default
  } catch {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
