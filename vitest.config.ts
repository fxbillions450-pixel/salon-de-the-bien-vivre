import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
      exclude: ['node_modules/', '.next/', 'playwright.config.ts', 'tests/e2e/**'],
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
