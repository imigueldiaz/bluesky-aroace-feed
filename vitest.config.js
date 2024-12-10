import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      exclude: ['node_modules/**', 'dist/**', '**/*.config.js'],
      all: true,
      clean: true,
      thresholds: {
        autoUpdate: true,
        perFile: true,
      },
    },
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.js'],
    deps: {
      interopDefault: true,
    },
  },
});
