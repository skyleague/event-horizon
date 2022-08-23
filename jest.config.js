module.exports = {
    roots: ['<rootDir>/src/', '<rootDir>/test/'],
    setupFilesAfterEnv: ['./test/__test__/setup.ts'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.{ts,tsx}', '!**/node_modules/**'],
    testRegex: '.spec.ts$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    coverageProvider: 'v8',
    collectCoverage: false,
    coverageDirectory: '<rootDir>/.coverage/',
    coverageReporters: ['lcov', 'text-summary'],
    fakeTimers: {
        enableGlobally: true,
        now: new Date(2022, 1, 10).valueOf(),
        doNotFake: ['setImmediate', 'nextTick', 'setTimeout'],
    },
}
