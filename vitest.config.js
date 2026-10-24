import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.js'],
    // Verbose reporter: prints a ✓/✗ line for every individual test,
    // so it is obvious at a glance which tests passed and which failed.
    reporter: 'verbose',
  },
});
