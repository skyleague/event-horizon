import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        globals: true,
        coverage: { reportsDirectory: './.coverage' },
        setupFiles: ['./test/__test__/setup.ts'],
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
