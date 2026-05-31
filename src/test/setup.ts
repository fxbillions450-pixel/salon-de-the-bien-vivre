import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/fr',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => [],
    set: vi.fn(),
    get: vi.fn(),
  }),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'fr',
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
  getTranslations: () => (key: string) => key,
}))

vi.mock('next-intl/navigation', () => ({
  createLocalizedPathnamesNavigation: () => ({
    Link: ({ href, children }: { href: string; children: React.ReactNode }) =>
      `<a href="${href}">${children}</a>`,
    redirect: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/fr',
  }),
  createSharedPathnamesNavigation: () => ({
    Link: ({ href, children }: { href: string; children: React.ReactNode }) =>
      `<a href="${href}">${children}</a>`,
    redirect: vi.fn(),
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})
