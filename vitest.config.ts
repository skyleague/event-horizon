import fs from 'node:fs'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globalSetup: fs.existsSync('./test/__test__/global.ts') ? ['./test/__test__/global.ts'] : [],
        setupFiles: ['./test/__test__/setup.ts'],
        include: ['./src/**/*.{test,spec}.{ts,js}', './test/**/*.{test,spec}.{ts,js}'],
        coverage: {
            reportsDirectory: './.coverage',
            exclude: ['**/*.schema.js', '**/*.schema.ts', '**/*.client.ts', '**/*.type.ts', ...coverageConfigDefaults.exclude],
        },
        fakeTimers: {
            now: new Date(2022, 1, 10).getTime(),
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
