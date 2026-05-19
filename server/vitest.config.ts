import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    env: {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '7d',
    },
  },
});