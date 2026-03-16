import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './docs/evidence/coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/types/**', 'src/test/**', 'src/app/layout.tsx'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
