import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        setupFiles: ['./test/__test__/setup.ts'],
        include: ['./src/**/*.{test,spec}.{ts,js}', './test/**/*.{test,spec}.{ts,js}'],
        coverage: {
            reportsDirectory: './.coverage',
        },
        fakeTimers: {
            now: new Date(2022, 1, 10).getTime(),
        },
    },
})
