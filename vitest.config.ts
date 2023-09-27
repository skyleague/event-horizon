import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./test/__test__/setup.ts'],
        include: ['./src/**/*.{test,spec}.{ts,js}', './test/**/*.{test,spec}.{ts,js}'],
        coverage: {
            provider: 'v8',
            reportsDirectory: './.coverage',
        },
        fakeTimers: {
            now: new Date(2022, 1, 10),
            toFake: [
                // 'setTimeout',
                // 'setImmediate',
                'clearTimeout',
                'setInterval',
                'clearInterval',
                'clearImmediate',
                'Date',
            ],
        },
    },
})
