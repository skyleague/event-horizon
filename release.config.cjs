module.exports = {
    branches: [
        { name: 'main' },
        ...(process.env.BETA_RELEASE === 'true'
            ? [
                  {
                      name: '/^[0-9]+-[0-9]+-(feat|fix|perf)_.*/',
                      prerelease: 'beta',
                      channel: 'beta',
                  },
              ]
            : []),
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
            },
        ],
        '@semantic-release/github',
        '@semantic-release/npm',
    ],
}
