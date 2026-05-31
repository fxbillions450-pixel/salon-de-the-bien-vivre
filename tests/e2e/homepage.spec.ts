import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('renders the French homepage by default', async ({ page }) => {
    await page.goto('/fr')
    await expect(page).toHaveTitle(/Salon de Thé Bien Vivre/)
  })

  test('renders the English homepage', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(/Salon de Thé Bien Vivre/)
  })

  test('has a navigation header', async ({ page }) => {
    await page.goto('/fr')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('has a main content area', async ({ page }) => {
    await page.goto('/fr')
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()
  })

  test('has a footer', async ({ page }) => {
    await page.goto('/fr')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('language switcher navigates to English', async ({ page }) => {
    await page.goto('/fr')
    const langSwitcher = page.locator('a[href="/en"]').first()
    await expect(langSwitcher).toBeVisible()
    await langSwitcher.click()
    await expect(page).toHaveURL(/\/en/)
  })
})

test.describe('Contact page', () => {
  test('renders the contact form', async ({ page }) => {
    await page.goto('/fr/contact')
    await expect(page.locator('form')).toBeVisible()
  })

  test('contact form has required fields', async ({ page }) => {
    await page.goto('/fr/contact')
    await expect(page.locator('#contact-name, #inquiry-name')).toBeVisible()
    await expect(page.locator('[type="email"]').first()).toBeVisible()
  })
})

test.describe('Menu page', () => {
  test('renders the menu page', async ({ page }) => {
    await page.goto('/fr/menu')
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })
})

test.describe('Experiences page', () => {
  test('renders the experiences page', async ({ page }) => {
    await page.goto('/fr/experiences')
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })
})

test.describe('FAQ page', () => {
  test('renders the FAQ page', async ({ page }) => {
    await page.goto('/fr/faq')
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('homepage has skip to main content or main id', async ({ page }) => {
    await page.goto('/fr')
    const main = page.locator('#main-content')
    await expect(main).toBeVisible()
  })

  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/fr')
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })
})
