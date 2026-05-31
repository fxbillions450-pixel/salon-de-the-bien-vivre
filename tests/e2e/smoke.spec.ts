import { test, expect } from '@playwright/test'

const PUBLIC_ROUTES = [
  { path: '/fr', label: '/fr' },
  { path: '/en', label: '/en' },
  { path: '/fr/menu', label: '/fr/menu' },
  { path: '/fr/experiences', label: '/fr/experiences' },
  { path: '/fr/contact', label: '/fr/contact' },
]

for (const { path, label } of PUBLIC_ROUTES) {
  test(`${label} — returns 200 and renders main content`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    const response = await page.goto(path)
    expect(response?.status(), `Expected 200 on ${path}`).toBe(200)

    // Server Component crash produces a page with no real body content
    const bodyText = await page.locator('body').innerText()
    expect(bodyText, `Page should not be blank`).not.toBe('')

    // Next.js Server Component error injects a known digest pattern
    const html = await page.content()
    expect(html, 'Should not contain __next_error__').not.toContain('__next_error__')

    // No uncaught JS errors
    expect(errors, `Uncaught errors on ${path}: ${errors.join('; ')}`).toHaveLength(0)
  })
}

test('/fr — has h1 heading', async ({ page }) => {
  await page.goto('/fr')
  await expect(page.locator('h1').first()).toBeVisible()
})

test('/fr — has navigation header', async ({ page }) => {
  await page.goto('/fr')
  await expect(page.locator('header')).toBeVisible()
})

test('/fr — has footer', async ({ page }) => {
  await page.goto('/fr')
  await expect(page.locator('footer')).toBeVisible()
})
